<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/usuarios" class="breadcrumb">Usuarios</router-link>
                        <router-link to="/administracion/nuevo-usuario" class="breadcrumb">Agregar</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row" style="margin-left:2em; margin-right:2em;">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="correo" v-model="usuario.correo" id="correo"/>
                        <label for="correo">Correo Electrónico</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="primerApellido" @input="usuario.primer_apellido = $event.target.value.toUpperCase()" :value="usuario.primer_apellido" id="primerApellido"/>
                        <label for="primer_apellido">Primer Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="segundoApellido" @input="usuario.segundo_apellido = $event.target.value.toUpperCase()" :value="usuario.segundo_apellido" id="segundo_apellido"/>
                        <label for="segundo_apellido">Segundo Apellido</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" ref="nombre" @input="usuario.nombre = $event.target.value.toUpperCase()" :value="usuario.nombre" id="nombre"/>
                        <label for="nombre">Nombre(s)</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m4 input-field">
                        <select title="asd" ref="area" v-model="usuario.area">
                            <option v-for="area in catalogos.areas" v-bind:key="area._id" v-bind:value="area">{{ area.nombre }}</option>
                        </select>
                        <label>Área</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <select title="asd" ref="area" v-model="usuario.tipo">
                            <option v-for="tipo in catalogos.tipos" v-bind:key="tipo._id" v-bind:value="tipo">{{ tipo.nombre }}</option>
                        </select>
                        <label>Tipo</label>
                    </div>
                    <div class="col s12 m4 input-field">
                        <input type="password" ref="clave" v-model="usuario.clave" id="clave" disabled/>
                        <label for="clave">Contraseña</label>
                    </div>
                </div>
                <button 
                    class="blue-colegio waves-effect btn right" 
                    style="margin-bottom:2em;" 
                    @click.prevent="guardarUsuario()"
                    :disabled="usuario.nombre == '' || usuario.tipo.nombre == '' || usuario.area.nombre == '' || disableSave">Agregar Usuario</button>
            </form>
        </div>
    </div>
</template>

<script>
import router from "../../router/index"
import {store, api_url} from "../../main"
import M from 'materialize-css'
import Preloader from '../../components/Preloader.vue'

export default ({
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
        async obtenerCatalogos(){
            await fetch(api_url + '/administracion/usuarios/catalogos', {
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

                    this.catalogos = response.catalogos
                    if(this.catalogos.areas.length == 0){
                        this.disableSave = true
                        M.toast({ 
                            html: 'No hay áreas definidas <a href="/administracion/areas" class="btn-flat toast-action">Agregar área</a>', 
                            displayLength: 10000, 
                            classes: 'orange darken-2'
                        })
                    }
                }).finally(() => { 
                    var selects = document.querySelectorAll('select')
                    M.FormSelect.init(selects, {})
                })
            })
        },
        async guardarUsuario(){
            this.isLoading = true
            await fetch(api_url + '/administracion/usuarios/', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
                body: JSON.stringify(this.usuario)
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
                    router.push('/administracion/usuarios/')
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data(){
        return {
            catalogos: {
                areas: [],
                tipos: []
            },
            usuario:{
                nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                correo: '',
                tipo: {
                    nombre: '',
                },
                area: {
                    nombre: ''
                },
                clave: '12345678'
            },
            disableSave: false,
            isLoading: false
        }
    }
})
</script>
