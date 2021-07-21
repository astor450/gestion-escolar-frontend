<template>
    <div class="container z-depth-1 mt-4">
        <div class="fixed-action-btn" style="margin-bottom:3em;">
            <router-link to="/administracion/nueva-asignatura" class="btn-floating btn-large waves-effect right">
                <i class="material-icons">add</i>
            </router-link>
        </div>
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
                        <th>Semestre</th>
                        <th>Nombre</th>
                        <th>Nivel Escolar</th>
                        <th>Tipo</th>
                        <th>Docente Asignado</th>
                        <th>Observaciones</th>
                        <th width="150" class="center">Acción</th>
                    </thead>
                    <tbody>
                        <tr v-for="asignatura in asignaturas" v-bind:key="asignatura._id">
                            <td>{{ asignatura.semestre.nombre }}</td>
                            <td>{{ asignatura.nombre }}</td>
                            <td>{{ asignatura.nivel }}</td>
                            <td>{{ asignatura.tipo }}</td>
                            <td>{{ (asignatura.docente_asignado != undefined) ? asignatura.docente_asignado.nivel.toUpperCase() + " " + asignatura.docente_asignado.nombre.toUpperCase() + " " + asignatura.docente_asignado.primer_apellido.toUpperCase() + " " + asignatura.docente_asignado.segundo_apellido.toUpperCase() : "" }}</td>
                            <td>{{ asignatura.observaciones }}</td>
                            <td class="center">
                                <router-link :to="'/administracion/asignaturas/' + asignatura._id" class="btn-flat btn-small waves-effect">
                                    <i class="material-icons">edit</i>
                                </router-link>
                                <a href="#confirmDelete" @click="confirmBorrar(asignatura)" class="btn-flat btn-small red-text waves-effect modal-trigger">
                                    <i class="material-icons">delete</i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span v-if="!hayRegistros">
                    No hay datos para mostrar
                </span>
            </div>
        </div>
    </div>

    <!-- Modal Structure -->
    <div id="confirmDelete" class="modal">
        <div class="modal-content">
            <h4 class="red-text center"><i class="material-icons">delete</i>&nbsp;¿Eliminar {{ asignatura.nombre }}?</h4>
            <p class="center mt-5" style="font-size:20px;">
                Esto ocasionará que la asignatura deje de estar disponible
            </p>
        </div>
        <div class="modal-footer">
            <a @click.prevent="eliminar(asignatura._id)" class="waves-effect btn red darken-2">Eliminar</a> &nbsp;
            <a href="#!" ref="cerrar_modal" class="modal-close waves-effect btn blue-colegio">Cancelar</a>
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
        var floatingButtons = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(floatingButtons);
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
        confirmBorrar(asignatura){
            this.asignatura = Object.assign({}, asignatura)
            var modals = document.querySelectorAll('.modal');
            M.Modal.init(modals, {});
        },
        async eliminar(){
            this.isLoading = true
            const asignatura_id = this.asignatura._id
            await fetch(api_url + '/administracion/asignaturas/' + asignatura_id, {
                method: 'DELETE',
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
                            M.toast({ html: response.message, classes: 'red darken-2' })
                            return false
                        }
                    }
                    M.toast({ html: response.message, classes: 'green darken-2'})
                    this.$refs.cerrar_modal.click()
                    this.obtenerAsignaturas()
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data() {
        return {
            hayRegistros: false,
            isLoading: false,
            asignaturas: [],
            asignatura: {

            },
        }
    }
})
</script>
