<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/periodos" class="breadcrumb">Periodos</router-link>
                        <router-link :to="'/administracion/periodo/' + periodo._id " class="breadcrumb">Editar</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <form class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" v-model="periodo.nombre" id="nombre"/>
                        <label for="nombre">Nombre</label>
                    </div>
                    <div class="col s12 m9 input-field">
                        <input type="text" v-model="periodo.descripcion" id="descripcion"/>
                        <label for="descripcion">Descripcion</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m3 input-field">
                        <input type="text" :value="periodo.inicio" @change="periodo.inicio =  obtenerFecha('inicio')" ref="inicio"  id="inicio" class="datepicker"/>
                        <label for="inicio">Inicio</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" :value="periodo.cierre" @change="periodo.cierre =  obtenerFecha('cierre')" ref="cierre" id="cierre" class="datepicker"/>
                        <label for="cierre">Cierre</label>
                    </div>
                    <div class="col s12 m2 input-field">
                        <label>
                            <input v-model="periodo.activo" ref="activo" id="activo" type="checkbox"/>
                            <span>Activo</span>
                        </label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <label>
                            <input type="checkbox" v-model="periodo.registro_activo" ref="registro_activo" id="registro_activo"/>
                            <span>Registro Activo</span>
                        </label>
                    </div>
                </div>
                <button 
                    class="blue-colegio waves-effect btn right" 
                    style="margin-bottom:2em;" 
                    :disabled="(periodo.nombre == '' || periodo.descripcion == '' || periodo.inicio == '' || periodo.cierre == '')"
                    @click.prevent="guardarPeriodo()"
                    >
                    Guardar
                </button>
            </form>
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
        var date_pickers = document.querySelectorAll('.datepicker');
        M.Datepicker.init(date_pickers, {
            format: 'yyyy-mm-dd'
        });
        this.informacionPeriodo()
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionPeriodo(){
            this.isLoading = true
            let periodo_id = this.$route.params.id
            await fetch(api_url + '/administracion/periodos/' + periodo_id,{
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
                    this.periodo = response.periodo
                }).finally(() => M.updateTextFields())
            }).finally(() => {
                this.isLoading = false
            })
        },
        async guardarPeriodo(){
            this.isLoading = true
            let periodo_id = this.$route.params.id
            await fetch(api_url + '/administracion/periodos/' + periodo_id,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + store.state.user.token
                },
                body: JSON.stringify(this.periodo)
            }).then((request) =>{
                request.json().then((response) => {
                    if(response.status != 'success'){
                        if(response.msg != "" && response.msg != undefined){
                            store.commit('logout')
                        } else {
                            M.toast({ html: response.message, classes: 'red darken-2' })
                            return false
                        }
                    }
                    M.toast({ html: response.message, classes: 'green darken-2' })
                    location.reaload()
                })
            }).finally(() => {
                this.isLoading = false
            })
        },
        obtenerFecha(elemento){
            elemento = this.$refs[elemento]
            let instancia = M.Datepicker.getInstance(elemento)
            return instancia.toString()
        }
    },
    data() {
        return {
            periodo: {
                nombre: '',
                inicio: '',
                cierre: '',
                descripcion: '',
                activo: false,
                registro_activo: false,
                _id: ''
            },
            catalogos:{
                
            },
            isLoading: false
        }
    }
})
</script>
