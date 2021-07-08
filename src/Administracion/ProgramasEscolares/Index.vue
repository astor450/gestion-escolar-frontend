<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/programas-escolares" class="breadcrumb">Programas Escolares</router-link>
                    </div>
                </div>
            </nav>
            <div class="col offset-m9 offset-l10 l2 m3 s12 mt-2" style="margin-bottom:0.5em;">
                <router-link
                    to="/administracion/nuevo-programa-escolar"
                    data-position="bottom" 
                    data-tooltip="Al dar clic aquí, será redirigido a otra ventana para agregar un nuevo usuario" 
                    class="btn btn-medium waves-effect waves-light blue-colegio tooltipped">
                        <i class="material-icons left">add</i>Nuevo Programa Escolar
                </router-link>
            </div>
        </div>
        <div class="row">
            <h5 class="center">Listado de Programas</h5>
            <div class="col s12 m12 center">
                <table class="striped responsive-table highlight">
                    <thead>
                        <th class="center">Semestre 
                            <button 
                                class="btn btn-flat btn-small tooltipped dropdown-trigger" 
                                data-tooltip="Filtrar"
                                data-target='catalogo-semestres'>
                                <i class="material-icons">filter_list</i>
                            </button>
                            <ul id='catalogo-semestres' class='dropdown-content'>
                                <li v-for="semestre in catalogos.periodos" v-bind:key="semestre._id">
                                    <a @click.prevent="console.log(this)">
                                        {{ semestre.nombre }}
                                    </a>
                                </li>
                            </ul>
                        </th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Asignaturas y Seminarios</th>
                        <th>Acción</th>
                    </thead>
                    <tbody>
                        <tr v-for="programa in programas" v-bind:key="programa._id">
                            <td class="center">{{ programa.semestre.nombre }}</td>
                            <td>{{ programa.nombre }}</td>
                            <td>{{ programa.habilitado ? "Activo" : "Inactiva" }}</td>
                            <td>
                                <div  v-if="programa.asignaturas.length == 0" class="red-text text-darken-2">
                                    Sin asignaturas asignadas
                                </div>
                                <span v-else>{{ programa.asignaturas.length }}</span>
                            </td>
                            <td>
                                <router-link :to="'/administracion/programa-escolar/' + programa._id"
                                    class="btn-flat btn-small tooltipped" 
                                    data-position="bottom" 
                                    data-tooltip="Editar y Administrar Asignaturas">
                                    <i class="material-icons">edit</i>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :minPage="1" v-on:cambio-ruta="obtenerListadoAreas()" :maxPage="maxPage" url="/administracion/programas-escolares" :currentPage="$route.query.page != undefined ? $route.query.page : 1" />
                <span v-if="!hayRegistros">
                    No hay datos para mostrar
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import Pagination from "../../components/Pagination.vue"
import {store, api_url} from "../../main"
import router from "../../router/index"
import M from "materialize-css"

export default({
    components: {
        Preloader,
        Pagination
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
            const page = this.$route.query.page != undefined ? this.$route.query.page : 1
            await fetch(api_url + '/administracion/programas-escolares/?page=' + page,{
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
                    this.programas = response.programas
                    if(this.programas.length != 0){
                        this.hayRegistros = true
                    }
                    this.catalogos = response.catalogos
                    this.maxPage  = response.pagination.maxPage
                }).finally(() => {
                    var tooltips = document.querySelectorAll('.tooltipped')
                    M.Tooltip.init(tooltips, { position: 'bottom' } )
                    var dropdown = document.querySelectorAll('.dropdown-trigger');
                    M.Dropdown.init(dropdown);
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
    },
    data() {
        return {
            hayRegistros: false,
            isLoading: false,
            programas: [],
            catalogos: {
                periodos: []
            },
            maxPage: 1,
        }
    }
})
</script>
