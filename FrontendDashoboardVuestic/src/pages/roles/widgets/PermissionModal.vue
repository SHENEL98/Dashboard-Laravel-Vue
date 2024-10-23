<template>
    Yolo {{ roleId }} - {{ roleName }}


</template>
<script>
    import { computed,ref, watch  } from 'vue';
    import axios from 'axios';

    export default{
        name: "RolePermissionModal",
        props: {
            rolePermisson: { type: Array},
        },
        data(){
            return {
                roleId: this.rolePermisson.id,
                roleName: this.rolePermisson.name
            }
        },
        mounted: function(){
            console.log("mounted "+ JSON.stringify(this.rolePermisson))
            this.usersAndhRoles()
        },
        methods: {
            usersAndhRoles(){
                 axios.get('api/getUserWithRoles/'+this.roleId)
                    .then((response)=> {
                        console.log("response : "+ JSON.stringify(response.data))
                    })
                    .catch((err) => {

                    })
            }
        }
    }
</script>