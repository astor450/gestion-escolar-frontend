<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/asignaturas" class="breadcrumb">Asignaturas</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <h5 class="center">Listado de Asignaturas y Seminarios</h5>
            <div class="col s12 m12 center">
                <table class="striped responsive-table highlight">
                    <thead>
                        <th>Nombre</th>
                        <th>Nivel Escolar</th>
                        <th>Tipo</th>
                        <th>Docente Asignado</th>
                        <th>Docente Propuesto</th>
                        <th>Acción</th>
                    </thead>
                    <tbody>
                        <tr v-for="asignatura in asignaturas" v-bind:key="asignatura._id">
                            <td>{{ asignatura.nombre }}</td>
                            <td>{{ asignatura.nivel }}</td>
                            <td>{{ asignatura.tipo }}</td>
                            <td>{{ asignatura.docente_asignado }}</td>
                            <td>{{ asignatura.docente_propuesto }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <span v-if="!hayRegistros">
                    No hay datos para mostrar
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import {api_url, store} from "../../main"
import router from "../../router/index"
import M from "materialize-css"
import Preloader from "../../components/Preloader.vue"

export default({
    components:{
        Preloader
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerAsignaturas()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async obtenerAsignaturas(){
            this.isLoading = true
            await fetch(api_url + '/administracion/asignaturas/',{
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
                    this.asignaturas = response.asignaturas
                    if(this.asignaturas.length != 0){
                        this.hayRegistros = true
                    }
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
            asignaturas: []
        }
    }
})
</script>
