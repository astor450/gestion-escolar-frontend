<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/permisos" class="breadcrumb">Permisos</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <h5 class="center">Listado de Permisos</h5>
            <div class="col s12 m12 center">
                <table class="striped responsive-table highlight">
                    <thead>
                        <th>Nombre</th>
                        <th>Código</th>
                    </thead>
                    <tbody>
                        <tr v-for="permiso in permisos" v-bind:key="permiso._id">
                            <td>{{ permiso.nombre }}</td>
                            <td>{{ permiso.codigo }}</td>
                        </tr>
                    </tbody>
                </table>
                <span v-if="!hayRegistros">
                    No hay datos para mostrar
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import { api_url, store } from "../../main"
import M from 'materialize-css'
import router from "../../router/index"

export default {
    components:{
        Preloader
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerListadoPermisos()
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerListadoPermisos(){
            this.isLoading = true
            await fetch(api_url + '/administracion/permisos/', {
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
                            M.toast({ html: response.message, classes: 'red darken-2' })
                            return false
                        }
                    }
                    this.permisos = response.permisos
                    if(this.permisos.length != 0){
                        this.hayRegistros = true
                    }
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data(){
        return {
            permisos: [],
            isLoading: false,
            hayRegistros: false,
        }
    }
}
</script>

<style>

</style>