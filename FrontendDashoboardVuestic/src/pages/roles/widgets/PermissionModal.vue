<template>
    Role Name : {{ roleName }}

  <form @submit.prevent="createUserRoles">
    <div class="row">
        <div class="flex flex-col md6" v-for="(user, index) in users" :key="index">
            <label class="m-2">
                <input type="checkbox"
                           class="form-checkbox"
                           v-model="selectedUsers"
                           :value="user.id" />
                    {{ user.name }}
            </label>
        </div>
    </div>
    <br>
    <div class="va-text-right">
        <VaButton type="submit">Save Role Assignments </VaButton>
    </div>
  </form>
</template>
<script> 
import { useToast } from 'vuestic-ui'
import axios from 'axios'

    export default{
        name: "RolePermissionModal",
        props: {
            rolePermisson: { type: Array},
        },
        data(){
            return {
                roleId: this.rolePermisson.id,
                roleName: this.rolePermisson.name,
                users: [], // All users
                selectedUsers: [] // Users already assigned to the role

            }
        },
        mounted: function(){
            console.log("mounted "+ JSON.stringify(this.rolePermisson))
            this.usersAndhRoles()
        },
        methods: {
            usersAndhRoles(){
                 axios.get('api/getUserWithRoles/'+this.roleId)
                    .then(response => {
                        this.users = response.data.allUser;
                        console.log("users : "+this.users)
                        this.selectedUsers = response.data.roleUsers; // Pre-check users with this role
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            createUserRoles(){
                const { init: notify } = useToast(); // Initialize the toast

                axios.post('/api/assignUsersToRole', {
                    role_id: this.roleId,
                    user_ids: this.selectedUsers // Send selected user IDs
                })
                .then(response => {
                    notify({
                        message: response.data.message,
                        color: 'success',  // Show success notification
                     });
                })
                .catch(err => {
                    notify({
                        message: 'Failed to assign users to role.',
                        color: 'success',  // Show success notification
                    });
                    console.log("err : "+err)
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "vuestic-ui/styles/grid";

.item {
  border: 1px solid var(--va-background-border);
  background-color: var(--va-background-primary);
  text-align: center;
}
</style>