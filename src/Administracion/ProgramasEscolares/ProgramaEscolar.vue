<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/programas-escolares" class="breadcrumb">Programas Escolares</router-link>
                        <router-link :to="'/administracion/programa-escolar/' + $route.params.id" class="breadcrumb">{{ programa.nombre }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m6" v-if="!editando">
                <strong>Nombre del programa</strong> <br />
                {{ programa.nombre }}
            </div>
            <div class="col s12 m6 input-field" v-else>
                <input type="text" v-model="programa.nombre" id="programa.nombre" />
                <label for="programa.nombre">Nombre del programa</label>
            </div>
            <div class="col s12 m3" v-if="!editando">
                <strong>Nivel</strong> <br />
                {{ programa.nivel }}
            </div>
            <div class="col s12 m6 input-field" v-else>
                <select title="asd" id="nivel" ref="nivel" v-model="programa.nivel">
                    <option value=""></option>
                    <option v-for="nivel in catalogos.niveles" v-bind:key="nivel">
                        {{ nivel }}
                    </option>
                </select>
                <label for="nivel">Nivel Escolar</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m6" v-if="!editando">
                <strong>Semestre</strong> <br />
                {{ programa.semestre.nombre }}
            </div>
            <div class="col s12 m6 input-field" v-else>
                <select title="asd" id="semestre" @change="hayCambios = true" ref="semestre" v-model="programa.semestre._id">
                    <option value=""></option>
                    <option v-for="semestre in catalogos.semestres" v-bind:key="semestre._id" v-bind:value="semestre._id">
                        {{ semestre.nombre }}
                    </option>
                </select>
                <label for="semestre">Semestre</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m12">
                <button 
                    v-if="editando"
                    class="red darken-2 waves-effect btn-small left" 
                    style="margin-bottom:1em;" 
                    @click.prevent="cancelarEdicion()"
                    >
                    <i class="material-icons">cancel</i>
                </button>
                <button 
                    v-if="!editando"
                    class="blue-colegio waves-effect btn-small left" 
                    style="margin-bottom:1em;" 
                    @click.prevent="habilitarEdicion()"
                    >
                    <i class="material-icons">edit</i>
                </button>
                <button 
                    class="blue-colegio waves-effect btn-small right" 
                    style="margin-bottom:1em;" 
                    :disabled="!hayCambios"
                    @click.prevent="guardarPrograma()"
                    >
                    Guardar
                </button>
            </div>
        </div>
        
        <hr style="margin-left:2em; margin-right:2em;"/>
        <div class="row">
            <div class="col s12 m6 ">
                <div class="row">
                    <h6 class="center">Asignaturas y Seminarios</h6>
                </div>
                <div class="row" style="max-height:30rem !important; overflow-y:scroll;">
                    <ul class="collapsible" style="margin-left:2em; margin-right:2em;">
                        <li v-for="asignatura in programa.asignaturas" v-bind:key="asignatura._id" style="user-select:none;" :ref="asignatura._id">
                            <div class="collapsible-header">
                                {{ asignatura.nombre }} &nbsp;  <span class="red-text" v-if="asignatura.docente_asignado == undefined || asignatura.docente_asignado == ''" >Sin Docente Asignado</span>
                                &nbsp; <button @click.prevent="quitar(asignatura)" class="btn-floating orange darken-2 right btn-small tooltipped" :data-tooltip="'Quitar de ' + programa.nombre">
                                    <i class="material-icons">arrow_forward</i>
                                </button>
                            </div>
                            <div class="collapsible-body">
                                <strong>Tipo: </strong>{{ asignatura.tipo }} <br/>
                                <span v-if="asignatura.docente_asignado !== undefined"><strong>Docente: </strong>{{ asignatura.docente_asignado.nivel }} {{ asignatura.docente_asignado.nombre }} {{ asignatura.docente_asignado.primer_apellido }} {{ asignatura.docente_asignado.segundo_apellido }} </span>
                                <strong>Semestre: </strong>{{ asignatura.semestre.nombre }} <br/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col s12 m6">
                <div class="row">
                    <h6 class="center">Asignaturas y Seminarios Disponibles</h6>
                </div>
                <div class="row" style="max-height:30rem !important; overflow-y:scroll;">
                    <ul class="collapsible" style="margin-left:2em; margin-right:2em;">
                        <li draggable v-for="asignatura in catalogos.asignaturas" v-bind:key="asignatura._id" style="user-select:none;" :ref="asignatura._id">
                            <div class="collapsible-header">
                                
                                <button @click.prevent="asignar(asignatura)" class="btn-floating left btn-small tooltipped" :data-tooltip="'Asignar a ' + programa.nombre">
                                    <i class="material-icons">arrow_back</i>
                                </button>
                                <span class="right">
                                    &nbsp; {{ asignatura.nombre }} &nbsp;  <span class="red-text" v-if="asignatura.docente_asignado == undefined || asignatura.docente_asignado == ''" >Sin Docente Asignado</span>
                                </span>
                            </div>
                            <div class="collapsible-body">
                                <strong>Tipo: </strong>{{ asignatura.tipo }} <br/>
                                <span v-if="asignatura.docente_asignado !== undefined"><strong>Docente: </strong>{{ asignatura.docente_asignado.nivel }} {{ asignatura.docente_asignado.nombre }} {{ asignatura.docente_asignado.primer_apellido }} {{ asignatura.docente_asignado.segundo_apellido }} </span>
                                <strong>Semestre: </strong>{{ asignatura.semestre.nombre }} <br/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import {store, api_url} from "../../main"
import router from "../../router/index"
import M from "materialize-css"

export default({
    components:{
        Preloader
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.informacionPrograma()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionPrograma(){
            this.isLoading = true
            const programa_id = this.$route.params.id
            await fetch(api_url + '/administracion/programas-escolares/' + programa_id, {
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
                    this.programa = response.programa
                    this.catalogos.semestres = response.catalogos.semestres
                    this.catalogos.asignaturas = response.catalogos.asignaturas
                }).finally(() => {
                    var elems = document.querySelectorAll('.collapsible');
                    M.Collapsible.init(elems);
                    var tooltips = document.querySelectorAll('.tooltipped')
                    M.Tooltip.init(tooltips, { position: 'bottom' } )
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        asignar(asignatura) {
            this.programa.asignaturas.push(asignatura)
            this.catalogos.asignaturas = this.catalogos.asignaturas.filter(asign => asign !== asignatura)
            this.hayCambios = true
        },
        quitar(asignatura){
            this.catalogos.asignaturas.push(asignatura)
            this.programa.asignaturas = this.programa.asignaturas.filter(asign => asign !== asignatura)
            this.hayCambios = true
        },
        async guardarPrograma(){
            this.isLoading = true
            const programa_id = this.$route.params.id
            await fetch(api_url + '/administracion/programas-escolares/' + programa_id, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
                body: JSON.stringify(this.programa)
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
                    M.toast({ html: response.message, classes: 'green darken-2'})
                    this.hayCambios = false
                    this.editando = false
                })
            }).finally(() => { 
                this.isLoading = false
            })
        },
        habilitarEdicion(){
            this.editando = true
            this.habilitarSelects()
            this.programa_holder = Object.assign({}, this.programa)
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
        cancelarEdicion(){
            this.editando = false
            this.habilitarSelects()
            this.programa = Object.assign({}, this.programa_holder)
            this.programa_holder = {
                nivel: '',
                nombre: '',
                year: '',
                periodo: '',
            }
        }
    },
    data(){
        return {
            programa: {
                asignaturas : [],
                nivel: '',
                nombre: '',
                year: '',
                habilitado: false,
                _id: '',
                periodo: '',
                semestre: {
                    nombre: '',
                    _id: '',
                }
            },
            catalogos: {
                asignaturas : [],
                niveles: [
                    'LICENCIATURA', 'MAESTRÍA', 'DOCTORADO'
                ],
                semestres: []
            },
            isLoading: false,
            editando: false,
            hayCambios: false,
            programa_holder: {
                nivel: '',
                nombre: '',
                year: '',
                periodo: '',
            },
        }
    }
})
</script>
