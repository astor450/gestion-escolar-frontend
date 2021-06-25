<template>
    <div class="container z-depth-1 mt-4">
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb">Administración</router-link>
                        <router-link to="/administracion/aspirantes" class="breadcrumb">Aspirantes</router-link>
                        <router-link :to="'/administracion/aspirante/' + $route.params.id" class="breadcrumb">{{ aspirante.nombre }} {{ aspirante.primer_apellido }} {{ aspirante.segundo_apellido }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m12 text-center">
                <div class="card-title flow-text">Datos Generales</div>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m2">
                <img src="@/assets/user_placeholder.png" style="width:100%;" :title="aspirante.nombre"/>
            </div>
            <div class="col s12 m10" v-show="!isLoading">
                <div class="row">
                    <div class="col s12 m6">
                        <strong>Programa:</strong> 
                        <br/>
                        {{ aspirante.programa_escolar }}
                    </div>
                    <div class="col s12 m6">
                        <strong>Estatus:</strong> 
                        <br/>
                        {{ aspirante.status }}
                    </div>
                </div>

                <div class="row">
                    <div class="col s12 m3">
                        <strong>CURP:</strong> 
                        <br/>
                        {{ aspirante.curp }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Nombre:</strong> 
                        <br/>
                        {{ aspirante.nombre }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Primer Apellido:</strong> 
                        <br/>
                        {{ aspirante.primer_apellido }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Segundo Apellido:</strong>
                        <br/>
                        {{ aspirante.segundo_apellido }}
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m3">
                        <strong>Fecha de Nacimiento:</strong> 
                        <br/>
                        {{ aspirante.fecha_nacimiento }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Nacionalidad:</strong> 
                        <br/>
                        {{ aspirante.nacionaliad }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Sexo:</strong> 
                        <br/>
                        {{ aspirante.genero }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Estado de Nacimiento:</strong> 
                        <br/>
                        {{ aspirante.estado_nacimiento }}
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <div class="row">
            <div class="col s12 m12 text-center">
                <div class="card-title flow-text">Datos de Contacto</div>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m12">
                <div class="row">
                    <div class="col s12 m3">
                        <strong>Email:</strong>
                        <br/>
                        {{ aspirante.email }}
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m4">
                        <strong>Teléfono Celular:</strong>
                        <br />
                        {{ aspirante.telefono_celular }}
                    </div>
                    <div class="col s12 m4">
                        <strong>Teléfono Fijo:</strong>
                        <br />
                        {{ aspirante.telefono_fijo }}
                    </div>
                    <div class="col s12 m3">
                        <strong>Teléfono Otro:</strong>
                        <br />
                        {{ aspirante.telefono_otro }}
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div class="row">
            <div class="col s12 m12 text-center">
                <div class="card-title flow-text">Domicilio</div>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m12">
                <div class="row">
                    <div class="col s12 m8">
                        <strong>Calle:</strong>
                        <br/>
                        {{ aspirante.calle }}
                    </div>
                    <div class="col s12 m2">
                        <strong>Número Exterior:</strong>
                        <br/>
                        {{ aspirante.numero }}
                    </div>
                    <div class="col s12 m2">
                        <strong>Número Interior:</strong>
                        <br/>
                        {{ aspirante.interior }}
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m4">
                        <strong>Código Postal:</strong>
                        <br/>
                        {{ aspirante.cp }}
                    </div>
                    <div class="col s12 m4">
                        <strong>Estado:</strong>
                        <br/>
                        {{ aspirante.estado }}
                    </div>
                    <div class="col s12 m4">
                        <strong>Municipico:</strong>
                        <br/>
                        {{ aspirante.municipio }}
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m4">
                    </div>
                </div>
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
        this.informacionAspirante()
    },
    components: {
        Preloader
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionAspirante(){
            this.isLoading = true
            let aspirante_id = this.$route.params.id
            fetch(api_url + '/administracion/aspirante/' + aspirante_id, {
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

                    this.aspirante = response.aspirante
                    this.aspirante.fecha_nacimiento = new Date(this.aspirante.fecha_nacimiento).toLocaleDateString()
                })
            }).finally(() => { this.isLoading = false })
        }
    },
    data(){
        return {
            aspirante: {

            },
            isLoading: false
        }
    }
}
</script>