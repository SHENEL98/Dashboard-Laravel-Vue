<script setup lang="ts">
import { PropType, computed } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Role } from '../types'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
import RoleStatusBadge from '../components/RoleStatusBadge.vue'
import { Pagination, Sorting } from '../../../data/pages/roles'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'Role name', key: 'name', sortable: true },
  { label: 'Permissions', key: 'role_owner', sortable: true },
  { label: 'Assigined to', key: 'status', sortable: true },
  { label: 'Creation Date', key: 'created_at', sortable: true },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  roles: {
    type: Array as PropType<Role[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  sortBy: {
    type: Object as PropType<Sorting['sortBy']>,
    required: true,
  },
  sortingOrder: {
    type: Object as PropType<Sorting['sortingOrder']>,
    required: true,
  },
  pagination: {
    type: Object as PropType<Pagination>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'edit', role: Role): void
  (event: 'delete', role: Role): void
}>()

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <div>
    <VaDataTable
      :items="roles"
      :columns="columns"
      :loading="loading"
    >
      <template #cell(role_name)="{ rowData }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ rowData.name }}
        </div>
      </template>
      <template #cell(role_owner)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.role_owner }}
        </div>
      </template>
      <template #cell(categories)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ rowData.categories }}
        </div>
        <!--<VaAvatarGroup
          size="small"
          :options="
            (role as Role).team.map((user) => ({
              label: user.fullname,
              src: user.avatar,
              fallbackText: user.fullname[0],
              color: avatarColor(user.fullname),
            }))
          "
          :max="5"
        />-->
      </template>
      <!-- <template #cell(status)="{ rowData: role }">
        <RoleStatusBadge :status="role.status" />
      </template> -->

      <template #cell(actions)="{ rowData: role }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit role"
            @click="$emit('edit', role as Role)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete role"
            @click="$emit('delete', role as Role)"
          />
        </div>
      </template>
    </VaDataTable>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
