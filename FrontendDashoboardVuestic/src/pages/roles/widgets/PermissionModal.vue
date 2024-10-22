<template>
    Yolo
</template>
<script>
    import { computed,ref, watch  } from 'vue';

    export default{
        name: "RolePermissionModal",
        props: {
            rolePermisson: { type: Array},
        },
        data(){
            return {

            }
        },
        mounted: function(){
            console.log("mounted ")
        }
    }
</script>