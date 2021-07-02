<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/periodos" class="breadcrumb">Periodos</router-link>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>


<script>
import { /* api_url ,*/ store } from '../../main'
import router from "../../router/index"
// import M from 'materialize-css'
import Preloader from '../../components/Preloader.vue'
export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
    },
    components:{
        Preloader
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
    },
    data(){
        return {
            
        }
    }
}
</script>

<style>
    
    
</style>