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
            <div class="col s12 m6">
                <strong>Nombre del programa</strong> <br />
                {{ programa.nombre }}
            </div>
            <div class="col s12 m3">
                <strong>Nivel</strong> <br />
                {{ programa.nivel }}
            </div>
        </div>
        <div class="row">
            <div class="col s12 m12">
                <button 
                    class="blue-colegio waves-effect btn right" 
                    style="margin-bottom:1em;" 
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
                <div class="row">
                    <ul class="collapsible" style="margin-left:2em; margin-right:2em;">
                        <li draggable v-for="asignatura in programa.asignaturas" v-bind:key="asignatura._id" style="user-select:none;" :ref="asignatura._id">
                            <div class="collapsible-header">
                                {{ asignatura.nombre }} &nbsp;
                                <button @click.prevent="quitar(asignatura)" class="btn-floating orange darken-2 right btn-small">
                                    <i class="material-icons">arrow_forward</i>
                                </button>
                            </div>
                            <div class="collapsible-body">
                                <strong>Tipo: </strong>{{ asignatura.tipo }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col s12 m6">
                <div class="row">
                    <h6 class="center">Asignaturas y Seminarios Disponibles</h6>
                </div>
                <div class="row">
                    <ul class="collapsible" style="margin-left:2em; margin-right:2em;">
                        <li draggable v-for="asignatura in catalogos.asignaturas" v-bind:key="asignatura._id" style="user-select:none;" :ref="asignatura._id">
                            <div class="collapsible-header">
                                
                                <button @click.prevent="asignar(asignatura)" class="btn-floating left btn-small">
                                    <i class="material-icons">arrow_back</i>
                                </button>
                                <span class="right">
                                    &nbsp; {{ asignatura.nombre }}
                                </span>
                            </div>
                            <div class="collapsible-body">
                                <strong>Tipo: </strong>{{ asignatura.tipo }}
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
                    this.catalogos = response.catalogos
                }).finally(() => {
                    var elems = document.querySelectorAll('.collapsible');
                    M.Collapsible.init(elems);
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        asignar(asignatura) {
            this.programa.asignaturas.push(asignatura)
            this.catalogos.asignaturas = this.catalogos.asignaturas.filter(asign => asign !== asignatura)
        },
        quitar(asignatura){
            this.catalogos.asignaturas.push(asignatura)
            this.programa.asignaturas = this.programa.asignaturas.filter(asign => asign !== asignatura)
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
                })
            }).finally(() => { 
                this.isLoading = false
            })
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
                _id: ''
            },
            catalogos: {
                asignaturas : []
            },
            isLoading: false,
        }
    }
})
</script>
