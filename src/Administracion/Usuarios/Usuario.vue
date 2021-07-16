<template>
    <div class="container z-depth-1 mt-4">
        <div class="fixed-action-btn" style="margin-bottom:3em;">
            <a class="btn-floating btn-large waves-effect right">
                <i class="material-icons">settings</i>
            </a>
            <ul>
                <li><a class="btn-floating green darken-2 tooltipped" data-tooltip="Modificar Permisos" @click.prevent="editarPermisos()"> <i class="material-icons">verified_user</i></a></li>
                <li><a class="btn-floating blue-colegio tooltipped" data-tooltip="Editar Usuario" @click.prevent="editar()"> <i class="material-icons">edit</i></a></li>
                <li v-if="usuario.habilitado">
                    <a href="#confirmBlock" class="btn-floating red darken-2 tooltipped modal-trigger" data-tooltip="Bloquear Acceso"> <i class="material-icons">block</i></a>
                </li>
                <li v-else>
                    <a href="#confirmBlock" class="btn-floating green darken-2 tooltipped modal-trigger" data-tooltip="Habilitar Acceso"> <i class="material-icons">lock_open</i></a>
                </li>
            </ul>
        </div>
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
                <img :src="usuario.foto == '' ? require('@/assets/user_placeholder.png') : usuario.foto" ref="profileImage" style="width:100%;" :title="usuario.nombre"/>
                <button v-if="!cambioImagen" ref="imagePicker" class="btn btn-floating right waves-effect" @click.prevent="this.$refs.findFoto.click();" style="position:relative; bottom:4em; right:1em;">
                    <i class="material-icons">add_a_photo</i>
                </button>
                <button v-else class="btn btn-floating right waves-effect green darken-2" @click.prevent="guardarImagen()" style="position:relative; bottom:4em; right:1em;">
                    <i class="material-icons">save</i>
                </button>
                <input type="file" ref="findFoto" v-show="false" @change="seleccionarImagen()"/>
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
                        {{ usuario.tipo.nombre }}
                    </div>
                    <div class="col s12 m3 input-field">
                        <strong>Área</strong><br/>
                        {{ usuario.area.nombre }}
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
                    <div class="col s12 m4 input-field">
                        <select type="text" v-model="usuario.area" id="area">
                            <option value=""></option>
                            <option v-for="area in catalogos.areas" v-bind:key="area._id" v-bind:value="area">{{ area.nombre }}</option>
                        </select>
                        <label for="tipo">Area</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12 m12" v-if="editando">
                    <button 
                        @click.prevent="guardarUsuario()"
                        class="btn blue-colegio btn-small right"
                        :disabled="usuario.nombre == '' || usuario.primer_apellido == '' || usuario.segundo_apellido == ''"
                        >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Structure -->
    <div id="confirmBlock" class="modal">
        <div class="modal-content">
            <h4 class="red-text center" v-if="usuario.habilitado"><i class="material-icons">block</i>Bloquear Acceso a {{ usuario.nombre }} {{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}</h4>
            <h4 class="green-text center" v-else><i class="material-icons">unlock</i>Permitir Acceso a {{ usuario.nombre }} {{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}</h4>
            <p class="center mt-5" style="font-size:20px;" v-if="usuario.habilitado">
                Esto ocasionará que {{ usuario.nombre }} {{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}
                No pueda iniciar sesión en la plataforma o realice movimiento alguno dentro de ella.
            </p>
            <p class="center mt-5" style="font-size:20px;" v-else>
                Esto ocasionará que {{ usuario.nombre }} {{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}
                pueda iniciar sesión en la plataforma y realice movimientos dentro de ella.
            </p>
        </div>
        <div class="modal-footer">
            <a @click.prevent="bloquear()" class="waves-effect btn red darken-2">Bloquear</a> &nbsp;
            <a href="#!" class="modal-close waves-effect btn blue-colegio">Cancelar</a>
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
        
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals, {});
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
                            M.toast({ html: response.message, classes: 'red darken-2' })
                            return false
                        }
                    }
                    this.usuario = response.usuario
                    this.catalogos.areas = response.catalogos.areas
                    this.catalogos.tipos = response.catalogos.tipos
                }).finally(() =>{
                    this.isLoading = false
                    var floatingButtons = document.querySelectorAll('.fixed-action-btn');
                    M.FloatingActionButton.init(floatingButtons);
                    var tooltips = document.querySelectorAll('.tooltipped')
                    M.Tooltip.init(tooltips, { position: 'bottom' } )
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
        async guardarUsuario(){
            const user_id = this.$route.params.id;
            this.isLoading = true
            await fetch(api_url + '/administracion/usuarios/' + user_id, {
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
                    this.editando = false
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        async seleccionarImagen(){
            this.isLoading = true
            this.$refs.profileImage.src =  await this.base64Photo()
            this.cambioImagen = true
        },
        base64Photo(){
            const ctx = this
            return new Promise((resolve, reject) =>{
                const reader = new FileReader();
                reader.readAsDataURL(this.$refs.findFoto.files[0])
                reader.onload = () => {
                    resolve(reader.result)
                    ctx.isLoading =  false
                }
                reader.onerror = error => {
                    reject(error)
                    ctx.isLoading =  false
                }
            })
        },
        async guardarImagen(){
            this.isLoading = true
            const user_id = this.$route.params.id;
            await fetch(api_url + '/administracion/usuarios/' + user_id + '?update=foto', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
                body: JSON.stringify({
                    foto: this.$refs.profileImage.src.split(',')[1],
                    extension: this.$refs.findFoto.files[0].name.split(".").pop()
                })
            }).then(request => {
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
                    this.editando = false
                    this.cambioImagen = false
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        async bloquear(){
            this.isLoading = true
            const user_id = this.$route.params.id
            await fetch(api_url + '/administracion/usuarios/' + user_id, {
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
                    router.push('/administracion/usuarios/')
                })
            }).finally(() => {
                this.isLoading = false
            })
        }
    },
    data(){
        return {
            isLoading: false,
            usuario: {
                tipo: {},
                area: {},
                habilitado: false,
            },
            catalogos: {
                areas: [],
                tipos: []
            },
            usuario_holder: {

            },
            editando: false,
            cambioImagen: false
        }
    }
}
</script>

<style>

</style>