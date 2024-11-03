<template>
   <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">        
        </div>
        <VaButton >Add User</VaButton>
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
import { defineVaDataTableColumns, VaDataTable } from 'vuestic-ui'

export default {
  data() {
    return {
        allUsers : {},

    }
  },
  mounted: function() {
    this.getAllUsers();
  },
  methods: {
    getAllUsers(){
        axios.get('api/users')
            .then(response => {
                this.allUsers = response.data;
                console.log("all users : "+ JSON.stringify(response.data))
            })
            .catch(err =>{
                console.log("errs :"+ err)
            })
    }
  },

  watch: {

  },
};
</script>