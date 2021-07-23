<template>
    <div class="container transparent mt-4">
        <div class="fixed-action-btn" style="margin-bottom:3em;">
            <a class="btn-floating btn-large waves-effect right">
                <i class="material-icons">settings</i>
            </a>
            <ul>
                <li><a class="btn-floating blue-colegio tooltipped" data-tooltip="Editar Usuario" @click.prevent="editar()"> <i class="material-icons">edit</i></a></li>
                <li><a class="btn-floating green tooltipped" data-tooltip="Agregar Carrera" @click.prevent="nueva_carrera()"> <i class="material-icons">book</i></a></li>
            </ul>
        </div>
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb hide-on-small-only">Administración</router-link>
                        <router-link to="/administracion/alumnos" class="breadcrumb hide-on-small-only">Alumnos</router-link>
                        <router-link :to="'/administracion/alumno/' + alumno._id " class="breadcrumb">{{ alumno.matricula }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m3">
                <div class="row">
                    <div class="col m12 white z-depth-2 center borders-7 card">
                        <div class="card-image">
                            <img :src="(alumno.foto == '' || alumno.foto == undefined)  ? require('@/assets/user_placeholder.png') : alumno.foto" ref="profileImage" style="width:100%;" :title="alumno.nombre" class="circle"/>
                            <button v-if="!cambioImagen" ref="imagePicker" class="btn btn-floating right waves-effect" @click.prevent="this.$refs.findFoto.click();" style="position:relative; bottom:4em; right:1em;">
                                <i class="material-icons">add_a_photo</i>
                            </button>
                            <button v-else class="btn btn-floating right waves-effect green darken-2" @click.prevent="guardarImagen()" style="position:relative; bottom:4em; right:1em;">
                                <i class="material-icons">save</i>
                            </button>
                            <input type="file" ref="findFoto" v-show="false" @change="seleccionarImagen()"/>
                            <span class="card-title black-text">
                                <strong>{{ alumno.nombre.toUpperCase() }} {{ alumno.apellidos.toUpperCase() }}</strong>
                            </span>
                        </div>
                        <div class="card-content">
                            <span v-if="alumno.curp != '' || alumno.curp != undefined">{{ alumno.curp }}</span>
                            <p v-else class="red-text">El alumno no tiene curp configurada</p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <div class="col m12 header" style="padding-bottom: 0.5em; padding-top: 0.5em;">
                            <span>
                                <strong >
                                    <i class="material-icons left">contact_mail</i> 
                                    Contacto
                                </strong>
                            </span>
                        </div>
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">email</i>
                                <span class="title" style="color: #888888">Email: </span>
                                <span>{{ alumno.correo }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Celular: </span>
                                <span>{{ alumno.telefono_celular }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Fijo: </span>
                                <span>{{ alumno.telefono_fijo }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Otro: </span>
                                <span>{{ alumno.telefono_trabajo }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <div class="col m12 header" style="padding-bottom: 0.5em; padding-top: 0.5em;">
                            <span>
                                <strong >
                                    <i class="material-icons left">fingerprint</i> 
                                    Identidad 
                                </strong>
                            </span>
                        </div>
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">CURP: </span>
                                <span>{{ alumno.curp }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Fecha Nacimiento: </span>
                                <span>{{ alumno.fecha_nacimiento }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Sexo: </span>
                                <span>{{ alumno.sexo == 'M' ? 'FEMENINO' : 'MASCULINO' }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Edo. Nacimiento: </span>
                                <span>{{ alumno.lugar_nacimiento_911 }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Nacionalidad: </span>
                                <span>{{ alumno.nacionaliad }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <div class="col m12 header" style="padding-bottom: 0.5em; padding-top: 0.5em;">
                            <span class="left mt-1">
                                <strong>
                                    <i class="material-icons left">location_on</i> 
                                    Domicilio
                                </strong>
                            </span>
                            <button @click="editarDomicilio()" class="btn-flat btn-small waves-effect right">
                                <i class="material-icons ">edit</i>
                            </button> 
                        </div>
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Calle: </span>
                                <span>{{ alumno.domicilio === undefined ? "" : alumno.domicilio.calle }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">No. Exterior: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.no_exterior }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">No. Interior: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.no_interior }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Estado: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.estado }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Municipico: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.municipio }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">CP.: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.cp }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Colonia.: </span>
                                <span>{{ alumno.domicilio === undefined ? "" :  alumno.domicilio.colonia }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <div class="col m12 header" style="padding-bottom: 0.5em; padding-top: 0.5em;">
                            <span>
                                <strong >
                                    <i class="material-icons left">accessible</i> 
                                    Inclusión y Accesibilidad
                                </strong>
                            </span>
                        </div>
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Discapacidad: </span>
                                <span>{{ alumno.discapacidad_911 }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Lengua Indígena: </span>
                                <span>{{ alumno.lengua_indigena_911 }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="col s12 m9 mt-2">
                <div class="row">
                    <div class="col m12"> 
                        <div class="white z-depth-2 borders-7">
                            <div class="row">
                                <div class="col s12 m12">
                                    <div class="with-header text-mutted" style="padding: 1em;">
                                        <h5><i class="material-icons left ">book</i>Carreras</h5>
                                    </div>
                                    <div class="row" v-if="agregar_carrera" style="padding: 1em;">
                                        
                                        <div class="col s12 m3 input-field">
                                            <input v-model="carrera.matricula" id="carrera.matricula" type="text" />
                                            <label for="carrera.matricula">Matrícula</label>
                                        </div>
                                        <div class="col s12 m6 input-field">
                                            <select v-model="carrera.programa" id="carrera.programa">
                                                <option> </option>
                                                <option v-for="programa in catalogos.programas" v-bind:key="programa._id" v-bind:value="programa._id">
                                                    {{ programa.nombre }}
                                                </option>
                                            </select>
                                            <label for="carrera.programa">Programa</label>
                                        </div>
                                        <div class="col s12 m3 input-field">
                                            <select v-model="carrera.etapa" id="carrera.etapa">
                                                <option> </option>
                                                <option v-for="etapa in catalogos.etapas" v-bind:key="etapa._id" v-bind:value="etapa._id">
                                                    {{ etapa.nombre }}
                                                </option>
                                            </select>
                                            <label for="carrera.programa">Etapa</label>
                                        </div>
                                    </div>
                                    <div class="row mt-n5" v-if="agregar_carrera" style="padding-right: 1em; padding-left: 1em;">
                                        <div class="col s12 m3 input-field">
                                            <input v-model="carrera.grado" id="carrera.grado" type="text" />
                                            <label for="carrera.grado">Grado</label>
                                        </div>
                                        <div class="col s12 m3 input-field">
                                            <select v-model="carrera.status" id="carrera.status">
                                                <option> </option>
                                                <option v-for="stat in catalogos.status" v-bind:key="stat._id" v-bind:value="stat._id">
                                                    {{ stat.nombre }}
                                                </option>
                                            </select>
                                            <label for="carrera.status">Estatus</label>
                                        </div>
                                        <div class="col s12 m3 input-field">
                                            <select v-model="carrera.periodo_ingreso" id="carrera.periodo_ingreso">
                                                <option> </option>
                                                <option v-for="periodo in catalogos.periodos" v-bind:key="periodo._id" v-bind:value="periodo._id">
                                                    {{ periodo.nombre }}
                                                </option>
                                            </select>
                                            <label for="carrera.periodo_ingreso">Periodo de Ingreso</label>
                                        </div>
                                        <div class="col s12 m3 input-field">
                                            <select v-model="carrera.periodo_ingreso" id="carrera.periodo_egreso">
                                                <option> </option>
                                                <option v-for="periodo in catalogos.periodos" v-bind:key="periodo._id" v-bind:value="periodo._id">
                                                    {{ periodo.nombre }}
                                                </option>
                                            </select>
                                            <label for="carrera.periodo_egreso">Periodo de Egreso</label>
                                        </div>
                                    </div>
                                    <div class="row"  v-if="agregar_carrera">
                                        <div class="col s12 m12 mt-n4">
                                            <button class="btn right waves-effect btn-small blue-colegio" @click="guardarCarrera()" style="margin:1em;">
                                                <i class="material-icons left">save</i> Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="" style="padding: 1em;">
                                <div class="row">
                                    <div class="col s12 m6" v-for="carrera in alumno.carreras" v-bind:key="carrera._id">
                                        <div class="card blue-colegio white-text">
                                            <div class="card-content">
                                                <div class="row">
                                                    <div class="col s12 m12 center">
                                                        <span class="card-title">
                                                            {{ carrera.programa.nombre.length > 30 ? carrera.programa.nombre.substring(0, 30) + "..." : carrera.programa.nombre }}
                                                        </span>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Matrícula:</span><br/><strong>{{ carrera.matricula }}</strong>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Status:</span><br/><strong>{{ carrera.status.nombre }}</strong>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Etapa:</span><br/><strong>{{ carrera.etapa.nombre }}</strong>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Grado:</span><br/><strong>{{ carrera.grado }}</strong>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Periodo Ingreso:</span><br/><strong>{{ carrera.periodo_ingreso.nombre }}</strong>
                                                    </div>
                                                    <div class="col s12 m6">
                                                        <span class="text-mutted">Periodo Egreso:</span><br/><strong>{{ carrera.periodo_egreso.nombre }}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="$store.state.user.permisos.includes('alumnos.ver_estados_de_cuenta')">
                    <div class="col m12"> 
                        <div class="white z-depth-2 borders-7">
                            <div class="with-header text-mutted" style="padding: 1em;">
                                <h5><i class="material-icons left ">attach_money</i>Estado de cuenta</h5>
                            </div>
                            <div class="row">
                                <div class="col m12 s12" style="padding: 2em;">
                                    <div class="with-header center" >
                                        <strong>Movimientos</strong>
                                    </div>
                                    <table class="striped responsive-table highlight">
                                        <thead>
                                            <th>Folio</th>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Vencimiento</th>
                                            <th>Concepto</th>
                                            <th>Cantidad</th>
                                            <th>Forma de Pago</th>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import { store, api_url } from "../../main"
import router from "../../router/index"
import M from "materialize-css"

export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.informacionAlumno()
        this.obtenerCatalogos()
    },
    components:{
        Preloader,
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionAlumno(){
            this.isLoading = true
            const alumno_id = this.$route.params.id
            await fetch(api_url + '/administracion/alumnos/' + alumno_id, { 
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
                    this.alumno = response.alumno
                })
            }).finally(() => { 
                this.isLoading = false 
                var floatingButtons = document.querySelectorAll('.fixed-action-btn');
                M.FloatingActionButton.init(floatingButtons);
                var tooltips = document.querySelectorAll('.tooltipped')
                M.Tooltip.init(tooltips, { position: 'left' } )
            })
        },
        async seleccionarImagen(){
            this.isLoading = true
            this.$refs.profileImage.src =  await this.base64Photo()
            this.cambioImagen = true
        },
        async obtenerCatalogos(){
            this.isLoading = true
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
                            M.toast({ html: response.message, classes: 'red darken-2' })
                            return false
                        }
                    }
                    this.catalogos = response.catalogos
                })
            }).finally(() => { 
                this.isLoading = false
            })
        },
        base64Photo(){
            const ctx = this
            return new Promise((resolve, reject) =>{
                const reader = new FileReader();
                reader.readAsDataURL(this.$refs.findFoto.files[0])
                reader.onload = () => {
                    resolve(reader.result)
                    ctx.isLoading =  false
                }
                reader.onerror = error => {
                    reject(error)
                    ctx.isLoading =  false
                }
            })
        },
        editarDomicilio(){
            this.editando_domicilio = true
        },
        nueva_carrera(){
            this.agregar_carrera = true
            this.habilitarSelects()
        },
        habilitarSelects(){
            return new Promise(() => {
                setTimeout(() =>{
                    let selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                    M.updateTextFields()
                }, 200)
            })
        },
        async guardarCarrera(){
            this.isLoading = true
            await fetch(api_url + '/administracion/alumnos/' + this.alumno._id + '/carreras', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
                body: JSON.stringify(this.carrera)
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
                    this.agregar_carrera = false
                    location.reload()
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data() {
        return { 
            isLoading: false,
            alumno: {
                nombre: '',
                apellidos: '',
                curp: '',
                calle: '',
                no_interior: '',
                no_exterior: '',
                estado: {
                    nombre: '',
                },
                municipio:{
                    nombre: ''
                },
                domicilio:{
                    calle:''
                },
                contacto:{},
                inclusion: {},
                estudios_previos: [],
                carreras: []
            },
            carrera: {
                matricula: '',
                programa: '',
                etapa: '',
                grado: '',
                status: '',
                periodo_ingreso: '',
                periodo_egreso: ''
            },
            catalogos: {
                programas: [],
                status: [],
                etapas: [],
                estados: [],
                periodos: [],
            },
            cambioImagen: false,
            editando_domicilio: false,
            agregar_carrera: false
        }
    }
}
</script>

<style>

</style>