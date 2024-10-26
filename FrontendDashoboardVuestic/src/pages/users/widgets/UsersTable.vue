<template>
   <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        
        </div>
        <VaButton >Add User</VaButton>
    </div>
  

      {{ allUsers }}

    <VaDataTable />
 
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