<template>
    <div class="container">
    </div>
</template>

<script>
import {api_url, store} from "../main"
import router from "../router/index"
import M from "materialize-css"

export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.info_aspirante()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/aspirante/login')
            }
            this.uname = store.state.user.name
        },
        async info_aspirante() {
            await fetch(api_url + '/aspirante/informacion', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                }
            }).catch(() => M.toast({ html: "No se puede obtener la información del servidor", classes: 'red darken-2' }))
        }
    },
}
</script>