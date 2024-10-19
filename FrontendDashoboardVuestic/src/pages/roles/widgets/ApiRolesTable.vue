<script setup lang="ts">
import { PropType, computed } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Role } from '../types'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
import RoleStatusBadge from '../components/RoleStatusBadge.vue'
import { Pagination, Sorting } from '../../../data/pages/roles'
import { useVModel } from '@vueuse/core'
import moment from "moment";

const columns = defineVaDataTableColumns([
  { label: 'Role name', key: 'name', sortable: true },
  { label: 'Permissions', key: 'permissions', sortable: false,},
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
      <!-- Custom template for the Permissions column -->
      <template #cell(permissions)="{ rowData: role }">
        <div>
          <span v-if="role.permissions.join(', ').length <= 25">
            {{ role.permissions.join(', ') }}
          </span>
          <span v-else>
            {{ role.permissions.join(', ').slice(0, 25) }}... (+{{ role.permissions.length }} more)
          </span>
        </div>
      </template>
      <template #cell(created_at)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]"> 
          {{ moment(rowData.created_at).format('DD-MMM-YYYY HH:mm') }}
        </div>
      </template>
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
