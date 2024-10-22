<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
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

// State for sorting
const sortBy = ref<string>('name') // Default sorting column
const sortingOrder = ref<'asc' | 'desc'>('asc') // Default sorting order

// Pagination state
const currentPage = ref(1)          // Current page number
const itemsPerPage = ref(10)        // Number of items per page
const totalItems = computed(() => props.roles.length)  // Total number of roles

// Computed property for sorted roles
const sortedRoles = computed(() => {
  // If no sorting column is defined, return the original data
  if (!sortBy.value) return props.roles

  // Sort the roles based on the selected column (sortBy) and sorting order (sortingOrder)
  return [...props.roles].sort((a, b) => {
    const aValue = a[sortBy.value as keyof Role]
    const bValue = b[sortBy.value as keyof Role]

    // Handle sorting for null or undefined values
    if (aValue == null && bValue != null) return sortingOrder.value === 'asc' ? 1 : -1
    if (aValue != null && bValue == null) return sortingOrder.value === 'asc' ? -1 : 1

    // If values are not null, compare them
    if (aValue < bValue) return sortingOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortingOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Computed property for paginated roles
const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedRoles.value.slice(start, end)
})

// Calculate the total number of pages
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Watch for changes in the sorting state (sortBy and sortingOrder)
watch([sortBy, sortingOrder], () => {
  console.log(`Sorting by ${sortBy.value} in ${sortingOrder.value} order`)
  // Reset to the first page after sorting
  currentPage.value = 1
})

// Watch for changes in itemsPerPage and adjust current page if necessary
watch(itemsPerPage, () => {
  currentPage.value = 1
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
    <VaDataTable
      :items="paginatedRoles"
      :columns="columns"
      :loading="loading"
      v-model:sort-by="sortBy"
      v-model:sorting-order="sortingOrder"
      hoverable
    >
      <!-- Custom template for the Permissions column -->
      <template #cell(permissions)="{ rowData: role }">
        <div>
          <span v-if="role.permissions.join(', ').length <= 25">
            {{ role.permissions.join(', ') }}
          </span>
          <span v-else :title="role.permissions ">
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
            color="success"
            icon="group-add"
            title="Permission Management"
            aria-label="Edit role"
            @click="$emit('permission_management', role as Role)"
          />
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
        <!-- Pagination Controls -->
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <!-- Results per page dropdown -->
      <div>
        <b>{{ totalItems }} results.</b> <!-- Show total results -->
        Results per page
        <VaSelect v-model="itemsPerPage" class="!w-20" :options="[10, 20, 50, 100]" /> <!-- Select items per page -->
      </div>

      <!-- Pagination buttons -->
      <div v-if="totalPages > 1" class="flex">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="currentPage === 1"
          @click="currentPage--"
        />
        <VaButton
          preset="secondary"
          icon="va-arrow-right"
          aria-label="Next page"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        />
        <VaPagination
          v-model="currentPage"
          :pages="totalPages"
          :visible-pages="5"
          :boundary-links="false"
          :direction-links="false"
        />
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
