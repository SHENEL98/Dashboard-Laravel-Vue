<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { EmptyRole, Role } from '../types'
import { SelectOption } from 'vuestic-ui'
import { useUsers } from '../../users/composables/useUsers'
import axios from 'axios'

const props = defineProps<{
  role: Role | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', role: Role): void
  (event: 'close'): void
}>()

const user = ref(null); // Set to null initially

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/user');
    user.value = data;

    // Now that user is loaded, set created_by for newBook if it's not already set
    if (!newRole.value.created_by) {
      newRole.value.created_by = user.value.id;
    }
  } catch (error) {
    console.error("Error fetching user", error);
  }
});

const defaultNewRole: EmptyRole = {
  name: '',
  role_owner: undefined,
  permissions : [],
  status: undefined,
  created_by: undefined,
}

const newRole = ref({ ...defaultNewRole })

const isForm_HasUnsavedChanges = computed(() => {
  return Object.keys(newRole.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newRole.value[key as keyof EmptyRole] !== (props.role ?? defaultNewRole)?.[key as keyof EmptyRole]
    )
  })
})

const isPermissionSelected = (permissionId: number) => {
  // Make sure newRole.value.permissions is always an array
  return Array.isArray(newRole.value.permissions) && newRole.value.permissions.includes(permissionId)
}

const togglePermission = (permissionId: number) => {
  // Ensure permissions is an array
  if (!Array.isArray(newRole.value.permissions)) {
    newRole.value.permissions = [] // Initialize as an empty array if undefined
  }

  const index = newRole.value.permissions.indexOf(permissionId)

  if (index > -1) {
    // Remove the permission from the array
    newRole.value.permissions = newRole.value.permissions.filter((id) => id !== permissionId)
  } else {
    // Add the new permission
    newRole.value.permissions.push(permissionId)
  }

  // Debugging: log the permissions to ensure they are updated correctly
  console.log('Updated Permissions:', newRole.value.permissions)

  // Trigger Vue reactivity by updating the object
  newRole.value = { ...newRole.value }
}

watch(
  () => props.role,
  () => {
    if (!props.role) {
      return
    }

    newRole.value = {
      ...props.role,
      role_owner: props.role.role_owner,
      permissions: props.role.permissions,
      status: props.role.status,
      created_by: user.value?.id || props.role.created_by, // Ensure created_by is set based on user data
    }
  },
  { immediate: true },
)
const test = () =>{
  alert("yolo")
}

const permissions = ref<any[]>([]) // Use appropriate type for permission data

onMounted(async() => {
  listOfPermissions();
});

const listOfPermissions = async() => {
  const response = await axios.get('/api/roles/create');
  permissions.value = response.data;
};

const required = (v: string | SelectOption) => !!v || 'This field is required'

const { users: teamUsers, filters: teamFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
const { users: ownerUsers, filters: ownerFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })

defineExpose({
  isForm_HasUnsavedChanges,
  isPermissionSelected,
  togglePermission,
  test
})
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newRole.name" label="Role name" :rules="[required]" />
 
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaListLabel>Role Permissions</VaListLabel>
      <div class="flex gap-2 flex-col sm:flex-row w-full" v-for="(itemPer, index) in permissions" :key="index">
          <input type="checkbox" class="form-check-input" :value="itemPer.id" v-model="newRole.permissions" />
          <label for="scales">{{itemPer.name}}</label>
      </div>
    </div>  

    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newRole as Role)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
