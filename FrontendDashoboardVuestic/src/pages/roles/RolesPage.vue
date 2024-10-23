<template>
  <h3 class="h3">Roles</h3>
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
        @permission_management="permissionManagement"
        @delete="onRoleDeleted"
        >
      </ApiRoleTable>
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
    <VaModal
      v-model="doShowPermission_FormModal"
      size="medium"
      hide-default-actions
    >
      <h1 class="va-h5 mb-4">Permission Management</h1>
      <PermissionModal
        ref="permission_FormRef"
        :rolePermisson="roleDetails"
       
      />
      <!--
       @save="
          (role) => {
            on_PermissionSaved(role)
            ok()
          }
        "
        -->
    </VaModal>
  </VaCard>
</template>
<script setup lang="ts">
import { ref , onMounted } from 'vue' 
import ApiRoleTable from './widgets/ApiRolesTable.vue'
import ApiEditRoleForm from './widgets/ApiEditRoleForm.vue'
import PermissionModal  from './widgets/PermissionModal.vue'
import { Role } from './types'
import { useModal, useToast } from 'vuestic-ui'
import axios from "axios" 

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

const roleDetails = ref<Role | null>(null)
const doShowPermission_FormModal = ref(false)

const permissionManagement = (role: Role) => {
  roleDetails.value = role
  doShowPermission_FormModal.value =true 
}

const { init: notify } = useToast()

const on_RoleSaved = async (role: Role) => {
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

const on_PermissionSaved = () => {
  console.log("save permisiion")
}

const { confirm } = useModal()

const onRoleDeleted = async (role: Role) => {
  const response = await confirm({
    title: 'Delete role',
    message: `Are you sure you want to delete role "${role.name}"?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await axios.delete('/api/roles/'+ role.id)
  notify({
    message: 'Role deleted',
    color: 'success',
  })

  // After deleting, call getAllRoles to refresh the data
  await getAllRoles();
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
   
    // First, store roles and rolePermissions
    allRoles.value = response.data.roles; // Assuming response.data is the array of roles
    let rolePermissions = response.data.rolePermissions;  // Assuming response.data is the array of rolePermissions

    // Map over allRoles and append permissions for each role
    allRoles.value = allRoles.value.map(role => {
        // Find permissions for the current role based on role_id
        let permissions = rolePermissions
            .filter(permission => permission.role_id === role.id)
            .map(permission => permission.permission_name);
        
        // Add a new property 'permissions' to the role with the array of permission names
        return {
            ...role, 
            permissions: permissions
        };
    });

    // Now allRoles will include the permissions array for each role
    console.log(allRoles);

  } catch (error) {
      notify({
        message: 'Error :'+error,
        color: 'danger',
      })
  }
};

onMounted(getAllRoles);

</script>