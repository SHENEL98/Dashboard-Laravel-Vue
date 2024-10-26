<template>
   <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
        
        </div>
        <VaButton >Add User</VaButton>
      </div>
  

      {{ allUsers }}
    <!-- --<VaDataTable
      :items="items"
      :columns="columns"
      :filter="filter"
      :filter-method="customFilteringFn"
      @filtered="filteredCount = $event.items.length"
    /> -->
  </template>

<script>
import axios from "axios";

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