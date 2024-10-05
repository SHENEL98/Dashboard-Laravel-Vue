<template>
  <h1 class="page-title">Roles</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        </div>
        <VaButton icon="add" @click="createNewRole">Role</VaButton>
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
      v-model="doShowRoleFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="roleToEdit === null" class="va-h5 mb-4">Add role</h1>
      <h1 v-else class="va-h5 mb-4">Edit role</h1>
      <EditRoleForm
        ref="editFormRef"
        :role="roleToEdit"
        :save-button-label="roleToEdit === null ? 'Add' : 'Save'"
        @close="cancel"
        @save="
          (role) => {
            onRoleSaved(role)
            ok()
          }
        "
      />
    </VaModal>
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
      />
    </VaModal>
  </VaCard>
</template>
<script setup lang="ts">
import { ref , onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useRoles } from './composables/useRoles'
import RoleTable from './widgets/RolesTable.vue'
import ApiRoleTable from './widgets/ApiRolesTable.vue'

import EditRoleForm from './widgets/EditRoleForm.vue'
import ApiEditRoleForm from './widgets/ApiEditRoleForm.vue'
import { Role } from './types'
import { useModal, useToast } from 'vuestic-ui'
import axios from "axios" 


const { roles, update, add, isLoading, remove, pagination, sorting } = useRoles()

const roleToEdit = ref<Role | null>(null)
const doShowRoleFormModal = ref(false)

const editRole = (role: Role) => {
  roleToEdit.value = role
  doShowRoleFormModal.value = true
}

const role_ToEdit = ref<Role | null>(null)
const doShowRole_FormModal = ref(false)

const edit_Role = (role: Role) => {
  role_ToEdit.value = role
  doShowRole_FormModal.value =true 
}
const createNewRole = () => {
  roleToEdit.value = null
  doShowRoleFormModal.value = true
}

const { init: notify } = useToast()

const onRoleSaved = async (role: Role) => {
  doShowRoleFormModal.value = false
  if ('id' in role) {
    await update(role as Role)
    notify({
      message: 'Role updated',
      color: 'success',
    })
  } else {
    await add(role as Role)
    notify({
      message: 'Role created',
      color: 'success',
    })
  }
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

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
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