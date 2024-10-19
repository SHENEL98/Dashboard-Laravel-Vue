<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Role } from '../types'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
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
})

// Define reactive states for pagination
const perPage = ref(10)  // Default items per page
const currentPage = ref(1)  // Default current page

// Compute total pages based on number of roles and perPage
const totalPages = computed(() => Math.ceil(props.roles.length / perPage.value))

// Compute the paginated roles to show based on currentPage and perPage
const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return props.roles.slice(start, end)
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

</script>

<template>
  <div>
    <VaDataTable
      :items="paginatedRoles"
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
    <!-- Pagination controls and results per page -->
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>{{ props.roles.length }} results.</b>
        Results per page:
        <VaSelect 
          v-model="perPage" 
          class="!w-20" 
          :options="[10, 50, 100]" 
        />
      </div>
      <!-- Pagination navigation -->
      <div v-if="totalPages > 1" class="flex items-center">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="currentPage === 1"
          @click="currentPage--"
        />
        <VaPagination
          v-model="currentPage"
          :pages="totalPages"
          buttons-preset="secondary"
          :visible-pages="5"
          :boundary-links="false"
          :direction-links="false"
          class="mx-2"
        />
        <VaButton
          preset="secondary"
          icon="va-arrow-right"
          aria-label="Next page"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        />
      </div>
    </div>
    <!-- / Pagination controls and results per page -->
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
