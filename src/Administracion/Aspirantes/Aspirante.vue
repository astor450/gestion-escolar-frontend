<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/aspirantes" class="breadcrumb">Aspirantes</router-link>
                        <router-link :to="'/administracion/aspirante/' + $route.params.id" class="breadcrumb">{{ aspirante.nombre }} {{ aspirante.primer_apellido }} {{ aspirante.segundo_apellido }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
import { api_url, store } from '../../main'
import router from "../../router/index"
import M from 'materialize-css'
import Preloader from '../../components/Preloader.vue'

export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.informacionAspirante()
    },
    components: {
        Preloader
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionAspirante(){
            this.isLoading = true
            let aspirante_id = this.$route.params.id
            fetch(api_url + '/administracion/aspirante/' + aspirante_id, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                }
            }).then((request) => {
                request.json().then((response) => {
                    if(response.status != 'success'){
                        if(response.msg != "" && response.msg != undefined){
                            store.commit('logout')
                        } else {
                            M.toast({ html: 'Error al obtener la información del servidor', classes: 'red darken-2' })
                            return false
                        }
                    }

                    this.aspirante = response.aspirante
                })
            }).finally(() => { this.isLoading = false })
        }
    },
    data(){
        return {
            aspirante: {

            },
            isLoading: false
        }
    }
}
</script>