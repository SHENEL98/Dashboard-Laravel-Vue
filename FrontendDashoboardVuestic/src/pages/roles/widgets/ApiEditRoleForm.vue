<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { EmptyRole, Role } from '../types'
import { SelectOption } from 'vuestic-ui'
import { useUsers } from '../../users/composables/useUsers'
import axios from 'axios'
import { useToast } from 'vuestic-ui'


const props = defineProps<{
  role: Role | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', role: Role): void
  (event: 'close'): void
}>()

const { init: notify } = useToast()
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
  permission : [],
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
  // Make sure newRole.value.permission is always an array
  return Array.isArray(newRole.value.permission) && newRole.value.permission.includes(permissionId)
}

/*const togglePermission = (permissionId: number) => {
  // Ensure permission is an array
  if (!Array.isArray(newRole.value.permission)) {
    newRole.value.permission = [] // Initialize as an empty array if undefined
  }

  const index = newRole.value.permission.indexOf(permissionId)

  if (index > -1) {
    // Remove the permission from the array
    newRole.value.permission = newRole.value.permission.filter((id) => id !== permissionId)
  } else {
    // Add the new permission
    newRole.value.permission.push(permissionId)
  }

  // Debugging: log the permission to ensure they are updated correctly
  console.log('Updated Permissions:', newRole.value.permission)

  // Trigger Vue reactivity by updating the object
  newRole.value = { ...newRole.value }
}*/

watch(
  () => props.role,
  () => {
    if (!props.role) {
      return
    }

    newRole.value = {
      ...props.role,
      role_owner: props.role.role_owner,
      permission: props.role.permission,
      status: props.role.status,
      created_by: user.value?.id || props.role.created_by, // Ensure created_by is set based on user data
    }
  },
  { immediate: true },
)
const permissions = ref([]);
const rolePermissions = ref([]);

const permission = ref<any[]>([]) // Use appropriate type for permission data

onMounted(async() => {
  if(props.role){
    getEditRolePermission();
  }else{
    listOfPermissions();
  }
});

const listOfPermissions = async() => {
  const response = await axios.get('/api/roles/create');
  permission.value = response.data;
};

const getEditRolePermission = async () => {
  try {
    const response = await axios.get('/api/roles/' + props.role.id + '/edit');
    
    if (response.status === 200) {
      permissions.value = response.data.data.permission;  // Full list of permissions
      rolePermissions.value = response.data.data.rolePermissions;  // Assigned permissions
      
      // Populate newRole.permission with the IDs from rolePermissions
      newRole.value.permission = Object.values(rolePermissions.value);

      console.log('Permissions:', permissions.value);
      console.log('Role Permissions:', rolePermissions.value);
      console.log('New Role Permissions:', newRole.value.permission);
    }
  } catch (error) {
    notify({
      message: error,
      color: 'danger',
    })
  }
};

const required = (v: string | SelectOption) => !!v || 'This field is required'

const { users: teamUsers, filters: teamFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
const { users: ownerUsers, filters: ownerFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })

defineExpose({
  isForm_HasUnsavedChanges,
  isPermissionSelected,
})
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newRole.name" label="Role name" :rules="[required]" />
 
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaListLabel>Role Permissions</VaListLabel>
      <template v-if="!props.role">
        <div class="flex gap-2 flex-col sm:flex-row w-full" v-for="(itemPer, index) in permission" :key="index">
          <input type="checkbox" class="form-check-input" :value="itemPer.id" v-model="newRole.permission" />
          <label for="scales">{{itemPer.name}}</label>
        </div>
      </template>
      <template v-else>
        <div class="flex gap-2 flex-col sm:flex-row w-full" v-for="(itemPer, index) in permissions" :key="index">
          <label class="m-2">
            <input type="checkbox" class="form-checkbox" v-model="newRole.permission" :value="itemPer.id" />
            {{ itemPer.name }}
          </label>
          <br>
        </div>
      </template>
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
