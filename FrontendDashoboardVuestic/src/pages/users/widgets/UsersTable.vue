<template>
   <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">        
        </div>
        <VaButton >Add User</VaButton>
    </div>

    <VaDataTable
    :items="paginatedItems"
      :columns="columns"
      :loading="loading"
      :pagination.sync="pagination"
      @sort="handleSort"
    >
      <template #cell(index)="{ rowIndex }">
        <div>{{ (pagination.currentPage - 1) * pagination.perPage + rowIndex + 1 }}</div>
      </template>

      <template #cell(created_at)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]"> 
          {{ formatDate(rowData.created_at) }}
        </div>
      </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <label for="resultsPerPage">Results per page: </label>
        <select id="resultsPerPage" v-model="pagination.perPage" class="p-2 border rounded">
          <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button @click="pagination.currentPage--" :disabled="pagination.currentPage === 1">Previous</button>
        <span>Page {{ pagination.currentPage }} of {{ totalPages }}</span>
        <button @click="pagination.currentPage++" :disabled="pagination.currentPage === totalPages">Next</button>
      </div>
    </div>


    <table class="table table-hover">
      <thead>
        <tr>
          <th>Index</th>
          <th>Name</th>
          <th>Email</th>
          <th>Roles</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Display a message if no users are found -->
        <tr v-if="!allUsers.length">
          <td colspan="5" style="text-align:center;">Data not found!</td>
        </tr>
        <!-- Loop through all users and display each one in a table row -->
        <tr v-for="(user, index) in allUsers" :key="user.id">
          <td>{{ index + 1 }}</td> <!-- Corrected index display -->
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span class="label label-info label-many">{{ user.roles.join(', ') }}</span> <!-- Corrected roles display -->
          </td>
          <td>
            <a href="#">
              <i class="fa fa-edit" @click="editModal(user)"></i>
            </a> 
            <a href="#" @click="deleteRole(user.id)">
              <i class="fa fa-trash red"></i>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </template>

<script>
import axios from "axios";
import { defineVaDataTableColumns } from 'vuestic-ui'
import moment from "moment";

export default {
  data() {
    return {
        allUsers : [],    // Initialize as an empty array
        columns : defineVaDataTableColumns([
          { label: 'Index', key: 'index', sortable: true  },  // Add index column
          { label: 'User name', key: 'name', sortable: true },
          { label: 'Email', key: 'email', sortable: true },
          { label: 'Roles', key: 'roles', sortable: true },
          { label: 'Created on', key: 'created_at', sortable: true },
          { label: ' ', key: 'actions' },
        ]),
        loading: true,  // Optional: indicate loading state
        pagination: {
          currentPage: 1,
          perPage: 10,
        },
        sorting: {
          key: '', // Default to no initial sorting
          order: 'asc', // Default sorting order
        },
        perPageOptions: [5, 10, 20, 50],
      }
  },
  computed: {
    paginatedItems() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.sortedItems.slice(start, end);
    },
    sortedItems() {
      // Sort `allUsers` based on `sorting` key and order
      if (!this.sorting.key) return this.allUsers;  // Return unsorted if no key is specified

      return [...this.allUsers].sort((a, b) => {
        const modifier = this.sorting.order === 'asc' ? 1 : -1;
        if (a[this.sorting.key] < b[this.sorting.key]) return -1 * modifier;
        if (a[this.sorting.key] > b[this.sorting.key]) return 1 * modifier;
        return 0;
      });
    },
    totalPages() {
      return Math.ceil(this.allUsers.length / this.pagination.perPage);
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
  },

  watch: {

  },
};
</script>