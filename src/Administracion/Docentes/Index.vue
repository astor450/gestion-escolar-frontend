<template>
    <div class="container z-depth-1 mt-4">
        <div class="fixed-action-btn" style="margin-bottom:3em;">
            <router-link 
                to="/administracion/nuevo-docente" 
                class="btn-floating btn-large waves-effect right"
                data-position="bottom" 
                data-tooltip="Al dar clic aquí, será redirigido a otra ventana para agregar un nuevo Docente"
                >
                <i class="material-icons">add</i>
            </router-link>
        </div>
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/docentes" class="breadcrumb">Docentes</router-link>
                    </div>
                </div>
            </nav>
        </div>
    </div>
    <div class="container z-depth-1 mt-4">
        <div class="row">
            <div class="m12 s12 text-center">
                <div style="margin-left:2em; margin-right:2em;">
                    <table class="striped responsive-table highlight">
                        <thead>
                            <th><i class="material-icons">image</i></th>
                            <th>Activo</th>
                            <th>Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>Correos</th>
                            <th>Nivel</th>
                            <th>Acción</th>
                        </thead>
                        <tbody>
                            <tr v-for="docente in docentes" v-bind:key="docente._id">
                                <td><img class="left mt-2" :src="docente.foto == '' ? require('@/assets/user_placeholder.png') : docente.foto" style="height:40px;"/></td>
                                <td></td>
                                <td>{{ docente.nombre }}</td>
                                <td>{{ docente.primer_apellido }}</td>
                                <td>{{ docente.segundo_apellido }}</td>
                                <td>
                                    <div class="chip" v-for="correo in docente.correos" v-bind:key="correo">
                                        <a :href="'mailto:' + correo" >
                                            {{ correo }}
                                        </a>
                                    </div>
                                </td>
                                <td>{{ docente.nivel }}</td>
                                <td class="center">
                                <router-link :to="'/administracion/docente/' + docente._id" class="btn-flat btn-small waves-effect">
                                    <i class="material-icons">remove_red_eye</i>
                                </router-link>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                    <Pagination v-if="hayRegistros" :minPage="1" v-on:cambio-ruta="obtenerListaDocentes()" :maxPage="maxPage" url="/administracion/docentes" :currentPage="$route.query.page != undefined ? $route.query.page : 1" />
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
import Pagination from '../../components/Pagination.vue'
import Preloader from '../../components/Preloader.vue'

export default {
    components:{
        Pagination, Preloader,
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerListaDocentes()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerListaDocentes(){
            this.isLoading = true
            const page = this.$route.query.page != undefined ? this.$route.query.page : 1
            await fetch(api_url + '/administracion/docentes/?page=' + page, {
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
                    this.docentes = response.docentes
                    this.maxPage  = response.pagination.maxPage
                    if(this.docentes.length != 0){
                        this.hayRegistros = true
                    }
                }).finally(() => {
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
            alumnos: [],
            hayRegistros: false,
            catalogos: [],
            maxPage: 1,
            isLoading: false
        }
    }
}
</script>
