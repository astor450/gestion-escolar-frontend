<template>
    <div class="container z-depth-1 mt-4">
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/alumnos" class="breadcrumb">Alumnos</router-link>
                        <router-link to="/administracion/nuevo-alumno" class="breadcrumb">Agregar</router-link>
                    </div>
                </div>
            </nav>
        </div>
        
        <div class="row" style="margin-left:2em; margin-right:2em;">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="matricula" @input="alumno.matricula = $event.target.value.toUpperCase()" :value="alumno.matricula" id="matricula"/>
                        <label for="matricula">Matrícula</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="primerApellido" @input="alumno.primer_apellido = $event.target.value.toUpperCase()" :value="alumno.primer_apellido" id="primerApellido"/>
                        <label for="primer_apellido">Primer Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="segundoApellido" @input="alumno.segundo_apellido = $event.target.value.toUpperCase()" :value="alumno.segundo_apellido" id="segundo_apellido"/>
                        <label for="segundo_apellido">Segundo Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="nombre" @input="alumno.nombre = $event.target.value.toUpperCase()" :value="alumno.nombre" id="nombre"/>
                        <label for="nombre">Nombre(s)</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" @change="validarCurp($event.target.value)" ref="curp" v-model="alumno.curp" id="curp"/>
                        <label for="curp">CURP</label>
                    </div>
                    <div class="input-field col s12 m3">
                        <select title="asd" ref="status" v-model="alumno.status">
                            <option> </option>
                            <option v-for="estado in catalogos.status" v-bind:key="estado._id" v-bind:value="estado._id">{{ estado.nombre }}</option>
                        </select>
                        <label>Estatus</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" @change="validarPeriodo('periodoIngreso')" ref="periodoIngreso" v-model="alumno.periodo_ingreso" id="periodo_ingreso"/>
                        <label for="periodo_ingreso">Periodo de Ingreso</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" @change="validarPeriodo('periodoEgreso')" ref="periodoEgreso" v-model="alumno.periodo_egreso" id="periodo_egreso"/>
                        <label for="periodo_egreso">Periodo de Egreso</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6 input-field">
                        <select title="asd" v-model="alumno.programa">
                            <option> </option>
                            <option v-for="carrera in catalogos.programas" v-bind:key="carrera._id" v-bind:value="carrera._id">{{ carrera.nombre }}</option>
                        </select>
                        <label for="buscar.carrera">Carrera</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <select title="asd" v-model="alumno.etapa">
                            <option> </option>
                            <option v-for="etapa in catalogos.etapas" v-bind:key="etapa._id" v-bind:value="etapa._id">{{ etapa.nombre }}</option>
                        </select>
                        <label for="buscar.etapa">Etapa</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="buscarPeriodoEgreso" v-model="alumno.periodo_egreso" id="buscar.periodo_egreso"/>
                        <label for="buscar.periodo_egreso">Grado</label>
                    </div>
                </div>
                <div class="row">
                    <button @click.prevent="iniciarRegistro()" class="btn waves-effect right">Siguiente  <i class="material-icons right">send</i></button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import router from "../../router/index"
import { api_url, store, periodoValido, curpValida } from "../../main"
import M from 'materialize-css'
import validate from 'validate.js'

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
            await fetch(api_url + '/administracion/alumnos/catalogos', {
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
        validarPeriodo(elemento){
            if(!periodoValido(this.$refs[elemento].value)){
                M.toast({ html: 'Formato de periodo no soportado', classes: 'red darken-2' })
                this.$refs[elemento].focus()
            }
        },
        actualizarStatus(){
            const status = this.$refs.status.value
            this.alumno.status = status
            console.log(status)
        },
        validarCurp(cadena){
            if(!curpValida(cadena)){
                M.toast({ html: 'CURP Inválido', classes: 'red darken-2' })
            }
        },
        async iniciarRegistro(){
            const resultado_validacion = validate(this.alumno, this.validarAlumno)
            if(!(resultado_validacion == undefined)){
                for(const regla in Object.values(resultado_validacion)){
                    console.log(regla)
                    M.toast({ html: regla, classes: 'red darken-2' })
                }
            }
        }
    },
    data(){
        return {
            alumno: {
                periodoEgreso: '',
                periodoIngreso: '',
                status: '',
                matricula: '',
                primer_apellido: '',
                segundo_apellido: '',
                nombre: '',
                curp: '',
                programa: '',
                etapa: ''
            },
            catalogos: [],
            validarAlumno:{
                curp: {
                    length: {
                        minimum: 1,
                        message: 'El alumno debe tener un CURP'
                    }
                },
                matricula: {
                    length: {
                        minimum: 1,
                        message: 'Debe Escribir una matrícula'
                    }
                },
                primer_apellido: {
                    presence: {
                        message: 'El primer apellido no puede estar vacío'
                    },
                    length: {
                        minimum: 1,
                        message: 'El primer apellido no puede estar vacío'
                    }
                },
                nombre: {
                    presence: {
                        message: 'El nombre no puede estar vacío'
                    },
                    length: {
                        minimum: 1,
                        message: 'El nombre no puede estar vacío'
                    }
                },
                periodoIngreso: {
                    length: {
                        minimum: 1,
                        message: 'Debe Seleccionar un periodo de Ingreso'
                    }
                },
                status: {
                    length: {
                        minimum: 1,
                        message: 'Debe Seleccionar un status'
                    }
                },
                programa: {
                    length: {
                        minimum: 1,
                        message: 'Debe seleccionar una carrera'
                    }
                },
                etapa: {
                    length: {
                        minimum: 1,
                        message: 'Debe seleccionar una carrera'
                    }
                }
            }
        }
    }
}
</script>
