<template>
    <div class="container z-depth-1 mt-4">
        <div class="row">
            <div class="col offset-m10 m2 s12 mt-2" style="margin-bottom:0.5em;">
                <a 
                    data-position="bottom" 
                    data-tooltip="Al dar clic aquí, será redirigido a otra ventana para agregar un nuevo alumno" 
                    class="btn btn-medium waves-effect waves-light blue-colegio tooltipped">
                        <i class="material-icons left">add</i>Nuevo Alumno
                </a>
            </div>
        </div>
        
        <div class="row" style="margin-left:2em; margin-right:2em;">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarMatricula" v-model="busqueda.matricula" id="buscar.matricula"/>
                        <label for="buscar.matricula">Matrícuala</label>
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
                            <th>#</th>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>Correo</th>
                            <th>Incrito desde</th>
                        </thead>
                        <tbody>
                            <tr v-for="alumno in alumnos" v-bind:key="alumno._id">

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
            await fetch(api_url + '/administracion/alumnos/', {
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
                    this.alumnos = response.alumnos
                    this.catalogos = response.catalogos
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
            alumnos: [],
            hayRegistros: false,
            busqueda: {
                matricula: ''
            },
            catalogos: [],
        }
    }
}
</script>
