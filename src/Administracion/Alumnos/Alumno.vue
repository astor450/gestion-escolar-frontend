<template>
    <div class="container transparent mt-4">
        <div class="fixed-action-btn" style="margin-bottom:3em;">
            <a class="btn-floating btn-large waves-effect right">
                <i class="material-icons">settings</i>
            </a>
            <ul>
                <li><a class="btn-floating green darken-2 tooltipped" data-tooltip="Modificar Permisos" @click.prevent="editarPermisos = true"> <i class="material-icons">verified_user</i></a></li>
                <li><a class="btn-floating blue-colegio tooltipped" data-tooltip="Editar Usuario" @click.prevent="editar()"> <i class="material-icons">edit</i></a></li>
            </ul>
        </div>
        <Preloader v-if="isLoading" />
        <div class="row">
            <nav>
                <div class="nav-wrapper blue-colegio">
                    <div class="col s12">
                        <router-link to="/administracion" class="breadcrumb hide-on-small-only">Administración</router-link>
                        <router-link to="/administracion/alumnos" class="breadcrumb hide-on-small-only">Alumnos</router-link>
                        <router-link :to="'/administracion/alumno/' + alumno._id " class="breadcrumb">{{ alumno.matricula }}</router-link>
                    </div>
                </div>
            </nav>
        </div>
        <div class="row">
            <div class="col s12 m3">
                <div class="row">
                    <div class="col m12 white z-depth-2 center borders-7 card">
                        <div class="card-image">
                            <img :src="(alumno.foto == '' || alumno.foto == undefined)  ? require('@/assets/user_placeholder.png') : alumno.foto" ref="profileImage" style="width:100%;" :title="alumno.nombre" class="circle"/>
                            <button v-if="!cambioImagen" ref="imagePicker" class="btn btn-floating right waves-effect" @click.prevent="this.$refs.findFoto.click();" style="position:relative; bottom:4em; right:1em;">
                                <i class="material-icons">add_a_photo</i>
                            </button>
                            <button v-else class="btn btn-floating right waves-effect green darken-2" @click.prevent="guardarImagen()" style="position:relative; bottom:4em; right:1em;">
                                <i class="material-icons">save</i>
                            </button>
                            <input type="file" ref="findFoto" v-show="false" @change="seleccionarImagen()"/>
                            <span class="card-title black-text">
                                <strong>{{ alumno.nombre.toUpperCase() }} {{ alumno.apellidos.toUpperCase() }}</strong>
                            </span>
                        </div>
                        <div class="card-content">
                            <span v-if="alumno.curp != '' || alumno.curp != undefined">{{ alumno.curp }}</span>
                            <p v-else class="red-text">El alumno no tiene curp configurada</p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">email</i>
                                <span class="title" style="color: #888888">Email: </span>
                                <span>{{ alumno.correo }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Celular: </span>
                                <span>{{ alumno.telefono_celular }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Fijo: </span>
                                <span>{{ alumno.telefono_fijo }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <i class="material-icons left" style="margin-left: -0.7em; color: #888888">contact_phone</i>
                                <span class="title" style="color: #888888">Otro: </span>
                                <span>{{ alumno.telefono_trabajo }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">CURP: </span>
                                <span>{{ alumno.curp }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Fecha Nacimiento: </span>
                                <span>{{ alumno.fecha_nacimiento }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Sexo: </span>
                                <span>{{ alumno.sexo == 'M' ? 'FEMENINO' : 'MASCULINO' }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Edo. Nacimiento: </span>
                                <span>{{ alumno.lugar_nacimiento_911 }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Nacionalidad: </span>
                                <span>{{ alumno.nacionaliad }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Calle: </span>
                                <span>{{ alumno.calle }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">No. Exterior: </span>
                                <span>{{ alumno.no_exterior }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">No. Interior: </span>
                                <span>{{ alumno.no_interior }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Estado: </span>
                                <span>{{ alumno.estado }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Municipico: </span>
                                <span>{{ alumno.municipio }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="white z-depth-2 borders-7">
                        <ul class="collection">
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Discapacidad: </span>
                                <span>{{ alumno.discapacidad_911 }}</span>
                            </li>
                            <li class="collection-item" style="margin: 10px;">
                                <span class="title" style="color: #888888">Lengua Indígena: </span>
                                <span>{{ alumno.lengua_indigena_911 }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="col s12 m9 mt-2">
                <div class="row">
                    <div class="col m12"> 
                        <div class="white z-depth-2 borders-7">
                            <div class="with-header text-mutted" style="padding: 1em;">
                                <h5><i class="material-icons left ">book</i>Carreras</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="$store.state.user.permisos.includes('alumnos.ver_estados_de_cuenta')">
                    <div class="col m12"> 
                        <div class="white z-depth-2 borders-7">
                            <div class="with-header text-mutted" style="padding: 1em;">
                                <h5><i class="material-icons left ">attach_money</i>Estado de cuenta</h5>
                            </div>
                            <div class="row">
                                <div class="col m12 s12" style="padding: 2em;">
                                    <div class="with-header center" >
                                        <strong>Movimientos</strong>
                                    </div>
                                    <table class="striped responsive-table highlight">
                                        <thead>
                                            <th>Folio</th>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Vencimiento</th>
                                            <th>Concepto</th>
                                            <th>Cantidad</th>
                                            <th>Forma de Pago</th>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Preloader from "../../components/Preloader.vue"
import { store, api_url } from "../../main"
import router from "../../router/index"
import M from "materialize-css"

export default {
    mounted(){
        this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
        this.check_login()
        this.informacionAlumno()
    },
    components:{
        Preloader,
    },
    methods:{
        check_login(){
            if(!this.logged_in){
                router.push('/administracion/login')
            }
            this.uname = store.state.user.name
        },
        async informacionAlumno(){
            this.isLoading = true
            const alumno_id = this.$route.params.id
            await fetch(api_url + '/administracion/alumnos/' + alumno_id, { 
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
                    this.alumno = response.alumno
                })
            }).finally(() => { 
                this.isLoading = false 
                var floatingButtons = document.querySelectorAll('.fixed-action-btn');
                M.FloatingActionButton.init(floatingButtons);
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
    },
    data() {
        return { 
            isLoading: false,
            alumno: {
                nombre: '',
                apellidos: '',
                curp: '',
                calle: '',
                no_interior: '',
                no_exterior: '',
                estado: {
                    nombre: '',
                },
                municipio:{
                    nombre: ''
                }
            },
            cambioImagen: false
        }
    }
}
</script>

<style>

</style>