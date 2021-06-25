<template>
    <div class="container z-depth-1 mt-4">
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/aspirantes" class="breadcrumb">Aspirantes</router-link>
                    </div>
                </div>
            </nav>
        </div>
        
        <div class="row" style="margin-left:2em; margin-right:2em;">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarMatricula" v-model="busqueda.matricula" id="buscar.matricula"/>
                        <label for="buscar.matricula">Matrícula</label>
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
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarCurp" v-model="busqueda.curp" id="buscar.curp"/>
                        <label for="buscar.curp">CURP</label>
                    </div>
                    <div class="input-field col s12 m3">
                        <select multiple="multiple" title="asd" @change="actualizarBusquedaStatus">
                            <option v-for="estado in catalogos.status" v-bind:key="estado._id" :value="estado._id">{{ estado.nombre }}</option>
                        </select>
                        <label>Estatus</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarPeriodoIngreso" v-model="busqueda.periodo_ingreso" id="buscar.periodo_ingreso"/>
                        <label for="buscar.periodo_ingreso">Periodo de Ingreso</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarPeriodoEgreso" v-model="busqueda.periodo_egreso" id="buscar.periodo_egreso"/>
                        <label for="buscar.periodo_egreso">Periodo de Egreso</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m8 input-field">
                        <select multiple="multiple" title="asd" @change="actualizarBusquedaStatus">
                            <option v-for="carrera in catalogos.programas" v-bind:key="carrera._id" :value="carrera._id">{{ carrera.nombre }}</option>
                        </select>
                        <label for="buscar.carrera">Carrera</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <select multiple="multiple" title="asd" @change="actualizarBusquedaStatus">
                            <option v-for="etapa in catalogos.etapas" v-bind:key="etapa._id" :value="etapa._id">{{ etapa.nombre }}</option>
                        </select>
                        <label for="buscar.etapa">Etapa</label>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="container-fluid z-depth-1 mt-4" style="background-color:white;">
        <Preloader v-if="isLoading" />
        <div class="row">
            <div class="m12 s12 text-center mt-3">
                <div style="margin-left:2em; margin-right:2em;" class="">
                    <table class="striped responsive-table highlight">
                        <thead>
                            <th>Acción</th>
                            <th>Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>CURP</th>
                            <th>Correo</th>
                            <th>Estatus</th>
                        </thead>
                        <tbody>
                            <tr v-for="aspirante in aspirantes" v-bind:key="aspirante._id">
                                <td>
                                    <router-link :to="'/administracion/aspirante/' + aspirante._id " class="btn-small btn-flat waves-effect">
                                        <i class="material-icons left">remove_red_eye</i> Ver
                                    </router-link>
                                </td>
                                <td>{{ aspirante.nombre }}</td>
                                <td>{{ aspirante.primer_apellido }}</td>
                                <td>{{ aspirante.segundo_apellido }}</td>
                                <td>{{ aspirante.curp }}</td>
                                <td>{{ aspirante.email }}</td>
                                <td>{{ aspirante.status_aspirante }}</td>
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
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerListadoAspirantes()
    },
    components:{
        Preloader
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerListadoAspirantes(){
            this.isLoading = true
            await fetch(api_url + '/administracion/alumnos/?tipo=aspirantes', {
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
                    this.aspirantes = response.alumnos
                    this.catalogos = response.catalogos
                    this.hayRegistros = this.aspirantes.length > 0 ? true : false
                }).finally(() => {
                    var selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                    this.isLoading = false
                })
            })
        },
        actualizarBusquedaStatus(){
            console.log(this)
        }
    },
    data(){
        return {
            aspirantes: [],
            hayRegistros: false,
            busqueda: {
                matricula: ''
            },
            catalogos: [],
            isLoading: false
        }
    }
}
</script>
