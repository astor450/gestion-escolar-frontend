<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/periodos" class="breadcrumb">Periodos</router-link>
                        <router-link to="/administracion/agregar-periodo" class="breadcrumb">Agregar</router-link>
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
                        <input type="text" v-model="periodo.inicio" id="inicio" class="datepicker"/>
                        <label for="inicio">Inicio</label>
                    </div>
                    <div class="col s12 m3 input-field">
                        <input type="text" v-model="periodo.cierre" id="cierre" class="datepicker"/>
                        <label for="cierre">Cierre</label>
                    </div>
                </div>
                <button 
                    class="blue-colegio waves-effect btn right" 
                    style="margin-bottom:2em;" 
                    :disabled="(periodo.nombre == '' || periodo.descripcion == '')"
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
        M.Datepicker.init(date_pickers);
    },
    methods: {
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async guardarPeriodo(){
            await fetch(api_url + '/administracion/periodos/guardar',{

            })
        }
    },
    data() {
        return {
            periodo: {
                nombre: '',
                inicio: '',
                cierre: '',
                descripcion: '',
                activo: false
            },
            catalogos:{
                
            },
            isLoading: false
        }
    }
})
</script>
