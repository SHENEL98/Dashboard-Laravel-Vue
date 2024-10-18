<template>
  <h1 class="page-title">Roles</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        </div>
        <VaButton icon="add" @click="createNew_Role">Role</VaButton>
      </div>
      <ApiRoleTable
        :roles="allRoles"
        :loading="isLoading"
        @edit="edit_Role"
        >
      </ApiRoleTable>
      <RoleTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        v-model:pagination="pagination"
        :roles="roles"
        :loading="isLoading"
        @edit="editRole"
        @delete="onRoleDeleted"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowRole_FormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="before_EditFormModalClose"
    >
      <h1 v-if="role_ToEdit === null" class="va-h5 mb-4">Add role</h1>
      <h1 v-else class="va-h5 mb-4">Edit role</h1>
      <ApiEditRoleForm
        ref="edit_FormRef"
        :role="role_ToEdit"
        :save-button-label="role_ToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (role) => {
            on_RoleSaved(role)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
<script setup lang="ts">
import { ref , onMounted } from 'vue'
import { useRoles } from './composables/useRoles'
import RoleTable from './widgets/RolesTable.vue'
import ApiRoleTable from './widgets/ApiRolesTable.vue'
import ApiEditRoleForm from './widgets/ApiEditRoleForm.vue'
import { Role } from './types'
import { useModal, useToast } from 'vuestic-ui'
import axios from "axios" 

const { roles, update, add, isLoading, remove, pagination, sorting } = useRoles()

const role_ToEdit = ref<Role | null>(null)
const doShowRole_FormModal = ref(false)

const edit_Role = (role: Role) => {
  role_ToEdit.value = role
  doShowRole_FormModal.value =true 
}

const createNew_Role = () => {
  role_ToEdit.value = null
  doShowRole_FormModal.value = true
}

const { init: notify } = useToast()

const on_RoleSaved = async (role: Role) => {
  console.log("role details :"+ JSON.stringify(role))
  console.log("role_ToEdit :"+ JSON.stringify(role_ToEdit))
  doShowRole_FormModal.value = false
  try{
    // create new role 
    if(!role_ToEdit._value){
      const response = await axios.post('api/roles',role);
      console.log("res :"+ JSON.stringify(response))
      if(!response){
        return;
      }
      notify({
        message: 'Book created',
        color: 'success',
      })
    }else{
      // edit existed role
      await axios.patch('/api/roles/'+role.id,role)
      .then(response => {
          if(response.status === 200){
            notify({
              message: 'Book updated',
              color: 'success',
            })
          }
          console.log("saved" + response.data.message);
      }).catch(error => {
          notify({
            message: error,
            color: 'danger',
          })
      });
    }
  }catch(err){
    console.log("error : "+ err)
    notify({
        message: err,
        color: 'danger',
      })
  }

    // After saving or updating, call getAllRoles to refresh the data
     await getAllRoles();
}

const { confirm } = useModal()

const onRoleDeleted = async (role: Role) => {
  const response = await confirm({
    title: 'Delete role',
    message: `Are you sure you want to delete role "${role.role_name}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await remove(role)
  notify({
    message: 'Role deleted',
    color: 'success',
  })
}

const edit_FormRef = ref()

const before_EditFormModalClose = async (hide: () => unknown) => {

  if (edit_FormRef.value.isForm_HasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const allRoles = ref([]);
const getAllRoles = async () => {
  try {
    const response = await axios.get('api/roles');
    console.log("roles:", response.data); // Adjusted to reflect the correct response structure
    allRoles.value = response.data; // Assuming response.data is the array of roles
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

onMounted(getAllRoles);

</script>