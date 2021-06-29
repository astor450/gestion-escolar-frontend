<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/areas" class="breadcrumb">Áreas</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <h5 class="left" style="margin-left:1em;">Nueva área</h5>
            <form class="col s12 m12">
                <div class="row valign-wrapper">
                    <div class="col m4 s12 input-field" style="margin-left:1em;">
                        <input type="text" ref="nombre" @input="area.nombre = $event.target.value.toUpperCase()" :value="area.nombre" id="nombre">
                        <label for="nombre">Nombre</label>
                    </div>
                    <button class="btn waves-effect blue-colegio" @click.prevent="agregarArea()"><span class="material-icons left">add</span></button>
                </div>
            </form>
        </div>
        <div class="row">
            <h5 class="center">Listado de Áreas</h5>
            <div class="col s12 m12 center">
                <table class="striped responsive-table highlight">
                    <thead>
                        <th width="65%">Nombre</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </thead>
                    <tbody>
                        <tr v-for="area in areas" v-bind:key="area._id">
                            <td>{{ area.nombre }}</td>
                            <td>{{ area.activo ? "Activa" : "Inactiva" }}</td>
                            <td>
                                <div class="switch">
                                    <label>
                                        Desactivar
                                        <input type="checkbox" v-model="area.activo" />
                                        <span class="lever"></span>
                                        Activar
                                    </label>
                                </div>
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
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import {store, api_url} from "../../main"
import router from "../../router/index"
import M from "materialize-css"
import validate from 'validate.js'

export default ({
    components: {
        Preloader
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerListadoAreas()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerListadoAreas(){
            this.isLoading = true
            await fetch(api_url + '/administracion/areas/',{
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
                    this.areas = response.areas
                    if(this.areas.length != 0){
                        this.hayRegistros = true
                    }
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        async agregarArea(){
            this.isLoading = true
            try {
                const resultado_validacion = validate(this.area, this.validarArea)
                console.log(resultado_validacion)
                if(!(resultado_validacion == undefined)){
                    Object.values(resultado_validacion).forEach(regla => {
                        M.toast({ html: regla, classes: 'orange darken-2' })
                    })
                    this.isLoading = false;
                    return false;
                }
                await fetch(api_url + '/administracion/areas/agregar',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + store.state.user.token
                    },
                    body: JSON.stringify(this.area)
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
                        M.toast({ html: response.message, classes: 'green darken-2'})
                        this.obtenerListadoAreas()
                    })
                })
            } catch (error) {
                M.toast({ html: error, classes: 'red darken-2'})
            } finally {
                this.isLoading = false
            }
        }
    },
    data(){
        return {
            areas: [],
            area: {
                nombre: '',
                _id: ''
            },
            disableSave: true,
            isLoading: false,
            validarArea: {
                nombre: {
                    length: {
                        minimum: 1,
                        message: 'Debe asignarle un nombre al área'
                    }
                },
            },
            hayRegistros: false,
        }
    }
})
</script>
