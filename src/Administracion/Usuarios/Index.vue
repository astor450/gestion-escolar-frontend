<template>
    <div class="container z-depth-1 mt-4">
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
                    <div class="col s12 m6 input-field">
                        <select multiple="multiple" title="asd">
                            <option v-for="rol in catalogos.roles" v-bind:key="rol._id" :value="rol._id">{{ rol.nombre }}</option>
                        </select>
                        <label for="buscar.carrera">Rol del Sistema</label>
                    </div>
                    <div class="col s12 m6 input-field">
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
                            <th>Acciones</th>
                            <th>#</th>
                            <th>Correo</th>
                            <th>Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>Tipo</th>
                            <th>Área</th>
                            <th>Roles</th>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in usuarios" v-bind:key="usuario._id">
                                <td></td>
                                <td></td>
                                <td>{{ usuario.correo }}</td>
                                <td>{{ usuario.nombre }}</td>
                                <td>{{ usuario.primer_apellido }}</td>
                                <td>{{ usuario.segundo_apellido }}</td>
                                <td>{{ usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1) }}</td>
                                <td></td>
                                <td></td>
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

export default {
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
                            M.toast({ html: 'Error al obtener la información del servidor', classes: 'red darken-2' })
                            return false
                        }
                    }
                    this.usuarios = response.usuarios
                    this.hayRegistros = this.usuarios.length != 0 ? true : false
                    // this.catalogos = response.catalogos
                }).finally(() => {
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
        }
    }
}
</script>
