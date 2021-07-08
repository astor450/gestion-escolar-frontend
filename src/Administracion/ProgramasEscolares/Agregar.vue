<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/programas-escolares" class="breadcrumb">Programas Escolares</router-link>
                        <router-link to="/administracion/nuevo-programa-escolar" class="breadcrumb">Agregar Programa Escolar</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m6 input-field">
                <input type="text" v-model="programa.nombre" id="programa.nombre" />
                <label for="programa.nombre">Nombre del programa</label>
            </div>
            <div class="col s12 m6 input-field">
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
            <div class="col s12 m6 input-field">
                <select title="asd" id="semestre" ref="semestre" v-model="programa.semestre._id">
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
                    class="blue-colegio waves-effect btn-small right" 
                    style="margin-bottom:1em;" 
                    :disabled="programa.nombre == '' || programa.nivel == '' || programa.semestre._id == ''"
                    @click.prevent="guardarPrograma()"
                    >
                    Guardar y Agregar Asignaturas
                </button>
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
        this.obtenerCatalogos()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async guardarPrograma(){
            this.isLoading = true
            await fetch(api_url + '/administracion/programas-escolares/', {
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
                    router.push('/administracion/programa-escolar/' + response.id)
                })
            }).finally(() => { 
                this.isLoading = false
            })
        },
        async obtenerCatalogos(){
            this.isLoading = true
            await fetch(api_url + '/administracion/programas-escolares/catalogos', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
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
                    this.catalogos.semestres = response.catalogos.semestres
                }).finally(() =>{
                    let selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                })
            }).finally(() => { this.isLoading = false })
        }
    },
    data(){
        return {
            programa: {
                asignaturas : [],
                nivel: '',
                nombre: '',
                year: '',
                habilitado: true,
                _id: '',
                periodo: '',
                semestre: {
                    nombre: '',
                    _id: '',
                }
            },
            catalogos: {
                niveles: [
                    'LICENCIATURA', 'MAESTRÍA', 'DOCTORADO'
                ],
                semestres: []
            },
            isLoading: false,
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
