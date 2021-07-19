<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/usuarios" class="breadcrumb">Usuarios</router-link>
                    </div>
                </div>
            </nav>
            <div class="col offset-m9 offset-l10 l2 m3 s12 mt-2" style="margin-bottom:0.5em;">
                <router-link
                    to="/administracion/nuevo-usuario"
                    data-position="bottom" 
                    data-tooltip="Al dar clic aquí, será redirigido a otra ventana para agregar un nuevo usuario" 
                    class="btn btn-medium waves-effect waves-light blue-colegio tooltipped">
                        <i class="material-icons left">add</i>Nuevo Usuario
                </router-link>
            </div>
        </div>
        
        <div class="row" style="margin-left:2em; margin-right:2em;">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarUsuario" v-model="busqueda.usuario" id="buscar.usuario"/>
                        <label for="buscar.usuario">Correo Electrónico</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarPrimerApellido" v-model="busqueda.primer_apellido" id="buscar.primer_apellido"/>
                        <label for="buscar.primer_apellido">Primer Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarSegundoApellido" v-model="busqueda.segundo_apellido" id="buscar.segundo_apellido"/>
                        <label for="buscar.segundo_apellido">Segundo Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarNombre" v-model="busqueda.nombre" id="buscar.nombre"/>
                        <label for="buscar.nombre">Nombre(s)</label>
                    </div>
                </div>
                <div class="row">
                    
                    <div class="col s12 m4 input-field">
                        <select multiple="multiple" title="asd">
                            <option v-for="area in catalogos.areas" v-bind:key="area._id" :value="area._id">{{ area.nombre }}</option>
                        </select>
                        <label for="buscar.carrera">Área</label>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="container z-depth-1 mt-4">
        <div class="row">
            <div class="m12 s12 text-center">
                <div style="margin-left:2em; margin-right:2em;">
                    <table class="striped responsive-table highlight">
                        <thead>
                            <th><i class="material-icons">image</i></th>
                            <th>Acceso</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>Tipo</th>
                            <th>Área</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in usuarios" v-bind:key="usuario._id">
                                <td><img class="left mt-2" :src="usuario.foto == '' ? require('@/assets/user_placeholder.png') : usuario.foto" style="height:40px;"/></td>
                                <td class="center" :class="{ 'red-text': !usuario.habilitado, 'green-text': usuario.habilitado }"><i class="material-icons" v-if="!usuario.habilitado">block</i><i class="material-icons" v-else>check</i></td>
                                <td>{{ usuario.correo }}</td>
                                <td>{{ usuario.nombre }}</td>
                                <td>{{ usuario.primer_apellido }}</td>
                                <td>{{ usuario.segundo_apellido }}</td>
                                <td>{{ usuario.tipo.nombre }}</td>
                                <td>{{ usuario.area.nombre }}</td>
                                <td>
                                    <router-link :to="'/administracion/usuarios/' + usuario._id" class="btn-flat waves-effect">
                                        <i class="material-icons">edit</i>
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <span v-if="!hayRegistros">
                        No hay datos para mostrar
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from "../../router/index"
import { api_url, store } from "../../main"
import M from 'materialize-css'
import Preloader from '../../components/Preloader.vue'

export default {
    components:{
        Preloader,
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerListadoAlumnos()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerListadoAlumnos(){
            this.isLoading = true
            await fetch(api_url + '/administracion/usuarios/', {
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
                            router.push('/administracion/')
                            return false
                        }
                    }
                    this.usuarios = response.usuarios
                    this.hayRegistros = this.usuarios.length != 0 ? true : false
                    // this.catalogos = response.catalogos
                }).finally(() => {
                    this.isLoading = false
                    var selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                })
            })
        },
        actualizarBusquedaStatus(){
            console.log(this)
        }
    },
    data(){
        return {
            usuarios: [],
            hayRegistros: false,
            busqueda: {
                matricula: ''
            },
            catalogos: {
                roles: []
            },
            isLoading: false
        }
    }
}
</script>
