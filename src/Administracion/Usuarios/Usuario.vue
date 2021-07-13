<template>
    <div class="container z-depth-1 mt-4">
        <button 
            style="position:fixed; bottom: 5em; right: 2em;" 
            class="btn-floating btn-large waves-effect right blue-colegio"
            @click.prevent="editar()">
            <i class="material-icons">edit</i>
        </button>
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/usuarios" class="breadcrumb">Usuarios</router-link>
                        <router-link :to="'/administracion/usuarios/' + usuario._id " class="breadcrumb">{{ usuario.correo }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m3">

            </div>
            <div class="col s12 m9">
                <div class="row" v-if="!editando">
                    <div class="col s12 m4">
                        <strong>Correo</strong><br/>
                        {{ usuario.correo }}
                    </div>
                    <div class="col s12 m4">
                        <strong>Nombre</strong><br/>
                        {{ usuario.nombre }}
                    </div>
                    <div class="col s12 m4">
                        <strong>Primer Apellido</strong><br/>
                        {{ usuario.primer_apellido }}
                    </div>
                </div>
                <div class="row" v-else>
                    <div class="col s12 m4 input-field">
                        <input type="text" v-model="usuario.correo" id="correo" />
                        <label for="correo">Correo</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <input type="text" v-model="usuario.nombre" id="nombre" />
                        <label for="nombre">Nombre</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <input type="text" v-model="usuario.primer_apellido" id="primer-apellido" />
                        <label for="primer-apellido">Primer Apellido</label>
                    </div>
                </div>
                <div class="row" v-if="!editando">
                    <div class="col s12 m3 input-field">
                        <strong>Segundo Apellido</strong><br/>
                        {{ usuario.segundo_apellido }}
                    </div>
                    <div class="col s12 m3 input-field">
                        <strong>Tipo</strong><br/>
                        {{ usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1) }}
                    </div>
                </div>
                <div class="row" v-else>
                    <div class="col s12 m4 input-field">
                        <input type="text" v-model="usuario.segundo_apellido" id="segundo-apellido" />
                        <label for="segundo-apellido">Segundo Apellido</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <select type="text" v-model="usuario.tipo" id="tipo">
                            <option value=""></option>
                            <option v-for="tipo in catalogos.tipos" v-bind:key="tipo._id" v-bind:value="tipo">{{ tipo.nombre }}</option>
                        </select>
                        <label for="tipo">Tipo</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import M from "materialize-css"
import {api_url, store} from "../../main"
import Preloader from "../../components/Preloader.vue"
import router from "../../router/index"

export default {
    components:{
        Preloader,
    },
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.obtenerInformacionUsuario()
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        editar(){
            this.editando = true
            this.usuario_holder = Object.assign({}, this.usuario)
            this.habilitarSelects()
        },
        async obtenerInformacionUsuario(){
            const user_id = this.$route.params.id;
            this.isLoading = true
            fetch(api_url + '/administracion/usuarios/' + user_id, {
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
                    this.usuario = response.usuario
                    this.catalogos.areas = response.catalogos.areas
                    this.catalogos.tipos = response.catalogos.tipos
                }).finally(() =>{
                    this.isLoading = false
                })
            }).finally(() =>{
                    this.isLoading = false
                })
        },
        habilitarSelects(){
            return new Promise(() => {
                setTimeout(() =>{
                    let selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                }, 200)
            })
        },
    },
    data(){
        return {
            isLoading: false,
            usuario: {
                tipo: ''
            },
            catalogos: {
                areas: [],
                tipos: []
            },
            usuario_holder: {

            },
            editando: false,
        }
    }
}
</script>

<style>

</style>