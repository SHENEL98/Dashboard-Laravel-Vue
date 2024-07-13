<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyRole, Role } from '../types'
import { SelectOption } from 'vuestic-ui'
import { useUsers } from '../../users/composables/useUsers'
import RoleStatusBadge from '../components/RoleStatusBadge.vue'
import UserAvatar from '../../users/widgets/UserAvatar.vue'

const props = defineProps<{
  role: Role | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', role: Role): void
  (event: 'close'): void
}>()

const defaultNewRole: EmptyRole = {
  role_name: '',
  role_owner: undefined,
  team: [],
  status: undefined,
}

const newRole = ref({ ...defaultNewRole })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newRole.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newRole.value[key as keyof EmptyRole] !== (props.role ?? defaultNewRole)?.[key as keyof EmptyRole]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.role,
  () => {
    if (!props.role) {
      return
    }

    newRole.value = {
      ...props.role,
      role_owner: props.role.role_owner,
    }
  },
  { immediate: true },
)

const required = (v: string | SelectOption) => !!v || 'This field is required'

const { users: teamUsers, filters: teamFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
const { users: ownerUsers, filters: ownerFilters } = useUsers({ pagination: ref({ page: 1, perPage: 100, total: 10 }) })
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newRole.role_name" label="Role name" :rules="[required]" />
    <VaSelect
      v-model="newRole.role_owner"
      v-model:search="ownerFilters.search"
      searchable
      label="Owner"
      text-by="fullname"
      track-by="id"
      :rules="[required]"
      :options="ownerUsers"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          <UserAvatar :user="user" size="18px" />
          {{ user.fullname }}
        </div>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newRole.team"
      v-model:search="teamFilters.search"
      label="Team"
      text-by="fullname"
      track-by="id"
      multiple
      :rules="[(v: any) => ('length' in v && v.length > 0) || 'This field is required']"
      :options="teamUsers"
      :max-visible-options="$vaBreakpoint.mdUp ? 3 : 1"
    >
      <template #content="{ valueArray }">
        <template v-if="valueArray">
          <div v-for="(user, index) in valueArray" :key="user.id" class="flex items-center gap-1 mr-2">
            <UserAvatar :user="user" size="18px" />
            {{ user.fullname }}{{ index < valueArray.length - 1 ? ',' : '' }}
          </div>
        </template>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newRole.status"
      label="Status"
      :rules="[required]"
      track-by="value"
      value-by="value"
      :options="[
        { text: 'In progress', value: 'in progress' },
        { text: 'Archived', value: 'archived' },
        { text: 'Completed', value: 'completed' },
        { text: 'Important', value: 'important' },
      ]"
    >
      <template #content="{ value }">
        <RoleStatusBadge v-if="value" :status="value.value" />
      </template>
    </VaSelect>
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
