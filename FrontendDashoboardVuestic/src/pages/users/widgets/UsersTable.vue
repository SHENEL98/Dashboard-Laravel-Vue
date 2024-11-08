<template>
   <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">        
        </div>
        <VaButton @click="addUser">Add User</VaButton>
    </div>

    <VaDataTable
      :items="paginatedUsers"
      :columns="columns"
      :loading="loading"
      v-model:sort-by="sortBy"
      v-model:sorting-order="sortingOrder"
      hoverable
    >
      <template #cell(created_at)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]"> 
          {{ formatDate(rowData.created_at) }}
        </div>
      </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <!-- Results per page dropdown -->
      <div>
        <b>{{ totalUsers }} results.</b> <!-- Show total results -->
        Results per page
        <VaSelect v-model="itemsPerPage" class="!w-20" :options="[10, 20, 50, 100]" />
      </div>
      <!-- Pagination buttons and page number display -->
      <div v-if="totalPages > 1" class="flex items-center gap-2">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="currentPage === 1"
          @click="currentPage--"
        />
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
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
    </div>
    
  </template>

<script>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { defineVaDataTableColumns } from 'vuestic-ui'
import moment from "moment";
import { addUser } from "../../../data/pages/users";

export default {
  data() {
    return {
        allUsers : [],    // Initialize as an empty array
        columns : defineVaDataTableColumns([
          { label: 'User name', key: 'name', sortable: true },
          { label: 'Email', key: 'email', sortable: true },
          { label: 'Roles', key: 'roles', sortable: true },
          { label: 'Created on', key: 'created_at', sortable: true },
          { label: ' ', key: 'actions' },
        ]),
        loading: true,  // Optional: indicate loading state
        // Sorting and pagination states
        sortBy: "name", // Default sorting column
        sortingOrder: "asc", // Default sorting order
        currentPage: 1, // Current page number
        itemsPerPage: 10, // Items per page
        doShowUserModal: false,
      }
  },
  computed: {
    // Total items count
    totalUsers() {
      return this.allUsers.length;
    },
    // Computed property for sorted users
    sortedUsers() {
      if (!this.sortBy) return this.allUsers;
      return [...this.allUsers].sort((a, b) => {
        const aValue = a[this.sortBy];
        const bValue = b[this.sortBy];

        // Handle sorting for null or undefined values
        if (aValue == null && bValue != null) return this.sortingOrder === "asc" ? 1 : -1;
        if (aValue != null && bValue == null) return this.sortingOrder === "asc" ? -1 : 1;

        // If values are not null, compare them
        if (aValue < bValue) return this.sortingOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return this.sortingOrder === "asc" ? 1 : -1;
        return 0;
      });
    },
    // Computed property for paginated users
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedUsers.slice(start, end);
    },
    // Calculate total pages
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage);
    }
  },
  mounted: function() {
    this.getAllUsers();
  },
  methods: {
    getAllUsers(){
        this.loading = true;  // Set loading to true while fetching
        axios.get('api/users')
            .then(response => {
                this.allUsers = response.data;
                console.log("all users : "+ JSON.stringify(response.data))
            })
            .catch(err =>{
                console.log("errs :"+ err)
            })
            .finally(() => {
              this.loading = false;  // Reset loading to false once finished
            });
    },
    formatDate(date) {
      return moment(date).format('DD-MMM-YYYY HH:mm');
    },
    addUser(){
      alert("adduserAlert")
    },
  },

  watch: {
    // Watch for changes in sorting state and reset to first page
    sortBy() {
      this.currentPage = 1;
    },
    sortingOrder() {
      this.currentPage = 1;
    },
    // Reset to first page when items per page changes
    itemsPerPage() {
      this.currentPage = 1;
    }
  },
};
</script>
<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>