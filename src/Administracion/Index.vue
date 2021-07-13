<template>
    <div class="container z-depth-1 mt-3">
        <Preloader v-if="isLoading" />
        <div class="row">
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 sticky-action unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">school</span>
                                <span class="card-title">
                                    {{ numero_alumnos }} Alumnos
                                </span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/alumnos" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Listado</router-link>
                                &nbsp;
                                <router-link style="color:white;" to="/administracion/nuevo-alumno" class="waves-effect btn-flat waves-light"><i class="material-icons left">person_add</i>Nuevo</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">person</span>
                                <span class="card-title">{{ numero_usuarios }} Usuarios</span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/usuarios" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Listado</router-link>
                                <router-link style="color:white;" to="/administracion/nuevo-usuario" class="waves-effect btn-flat waves-light"><i class="material-icons left">person_add</i>Nuevo</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">hourglass_empty</span>
                                <span class="card-title">{{ numero_aspirantes }} Aspirantes</span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/aspirantes" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Listado</router-link>
                                <!-- <router-link style="color:white;" to="/administracion/aspirante/nuevo" class="waves-effect btn-flat waves-light"><i class="material-icons left">person_add</i>Agregar nuevo</router-link> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 sticky-action unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">domain</span>
                                <span class="card-title">
                                    {{ numero_areas }} Áreas
                                </span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/areas" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Administrar</router-link>
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 sticky-action unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">domain</span>
                                <span class="card-title">
                                    {{ numero_asignaturas }} Asignaturas y Seminarios
                                </span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/asignaturas" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Listado</router-link>
                                <router-link style="color:white;" to="/administracion/nueva-asignatura" class="waves-effect btn-flat waves-light"><i class="material-icons left">add</i>Nueva</router-link>
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col l4 m2 s12">
                <div class="row">
                    <div class="col s12 m12">
                        <div class="card blue-colegio darken-1 sticky-action unselectable">
                            <div class="card-content white-text text-center">
                                <span class="material-icons" style="font-size: 48px">playlist_add_check</span>
                                <span class="card-title">
                                    {{ numero_programas }} Programas Escolares
                                </span>
                            </div>
                            <div class="card-action">
                                <router-link style="color:white;" to="/administracion/programas-escolares" class="waves-effect btn-flat waves-light"><i class="material-icons left">format_list_bulleted</i>Listado</router-link>
                                <router-link style="color:white;" to="/administracion/nuevo-programa-escolar" class="waves-effect btn-flat waves-light"><i class="material-icons left">add</i>Nuevo</router-link>
                                &nbsp;
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
import Preloader from '../components/Preloader.vue'
export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.dashboardAdmin()
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
        async dashboardAdmin() {
            this.isLoading = true
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
                    this.numero_aspirantes = response.cantidad_aspirantes
                    this.numero_areas = response.cantidad_areas
                    this.numero_asignaturas = response.cantidad_asignaturas
                    this.numero_programas = response.cantidad_programas
                    
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data(){
        return {
            numero_alumnos: 0,
            numero_usuarios: 0,
            numero_aspirantes: 0,
            numero_asignaturas: 0,
            isLoading: false,
            numero_areas: 0,
            numero_programas: 0,
        }
    }
}
</script>

<style>
    
    
</style>