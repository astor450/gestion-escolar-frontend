<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/periodos" class="breadcrumb">Periodos</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m12">
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
                                <li v-for="semestre in periodos" v-bind:key="semestre._id">
                                    <a @click.prevent="console.log(this)">
                                        {{ semestre.nombre }}
                                    </a>
                                </li>
                            </ul>
                        </th>
                        <th>Descripción</th>
                        <th>Activo</th>
                        <th>Inicio</th>
                        <th>Cierre</th>
                        <th>Acciones</th>
                    </thead>
                    <tbody>
                        <tr v-for="periodo in periodos" v-bind:key="periodo._id">
                            <td class="center">{{ periodo.nombre }}</td>
                            <td>{{ periodo.descripcion }}</td>
                            <td>{{ periodo.activo ? "Activo" : "Inactivo" }}</td>
                            <td>{{ periodo.inicio }}</td>
                            <td>{{ periodo.cierre }}</td>
                            <td>
                                <router-link :to="'/administracion/periodo/' + periodo._id"
                                    class="btn-flat btn-small tooltipped" 
                                    data-position="bottom" 
                                    data-tooltip="Editar Periodo">
                                    <i class="material-icons">edit</i>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import { api_url, store } from '../../main'
import router from "../../router/index"
import M from 'materialize-css'
import Preloader from '../../components/Preloader.vue'
export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerPeriodos()
    },
    components:{
        Preloader
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerPeriodos(){
            this.isLoading = true
            await fetch(api_url + '/administracion/periodos/', {
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
                    this.periodos = response.periodos
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data(){
        return {
            isLoading: false,
            periodos: []
        }
    }
}
</script>

<style>
    
    
</style>