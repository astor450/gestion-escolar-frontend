<template>
    <div class="container z-depth-1 mt-3">
        <div class="row">
            <div class="col m6 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1">
                            <div class="card-content white-text text-center">
                                <span class="card-title">{{ numero_alumnos }}</span>
                                <p>Alumnos en sistema</p>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/alumnos">Ir al listado</router-link>
                                <router-link style="color:white;" to="/administracion/alumnos/nuevo">Agregar nuevo</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col m6 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1">
                            <div class="card-content white-text text-center">
                                <span class="card-title">{{ numero_usuarios }}</span>
                                <p>Usuarios en sistema</p>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/usuarios">Ir al listado</router-link>
                                <router-link style="color:white;" to="/administracion/usuario/nuevo">Agregar nuevo</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api_url, store } from '../main'
import router from "../router/index"
import M from 'materialize-css'
export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.dashboardAdmin()
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async dashboardAdmin() {
            await fetch(api_url + '/administracion/', {
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
                    this.numero_alumnos = response.cuenta_alumnos
                    this.numero_usuarios = response.cantidad_usuarios
                })
            })
        }
    },
    data(){
        return {
            numero_alumnos: 0,
            numero_usuarios: 0
        }
    }
}
</script>

<style>
    
    
</style>