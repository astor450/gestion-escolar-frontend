<template>
  <nav class="white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/logo_colegio.png" alt=""  height="60" class="d-inline-block align-text-middle" />
      </a>
      <ul v-show="logged_in" class="right">
        <li>
          <a class="dropdown-trigger" style="background-color: #64646C; !important" href="#!" ref="sessionButton" data-target="dropdown1">
            <img class="left mt-2" :src="foto == '' ? require('@/assets/user_placeholder.png') : foto" style="height:40px;"/> &nbsp;
            {{ uname }} <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
      </ul>
      <ul v-show="logged_in" id='dropdown1' class='dropdown-content'>
        <li><a href="#!" @click.prevent="cerrarSesion">Cerrar sesión</a></li>
      </ul>
    </div>
  </nav>
  <router-view />
  <footer v-if="logged_in && request_finished" class="page-footer" :class="{ ' teal darken-1': (periodo_actual.nombre != '' && periodo_actual.activo ), 'red darken-2': (periodo_actual.nombre == '' || !periodo_actual.activo) }">
      <span style="margin-left:2em; margin-right:2em;" v-if="periodo_actual.nombre != '' && periodo_actual.activo">
        El periodo actual es: {{ periodo_actual.nombre }}, "{{ periodo_actual.descripcion }}" que comprende desde: {{ periodo_actual.inicio }} hasta: {{ periodo_actual.cierre }}
      </span>
      <span style="margin-left:2em; margin-right:2em;" v-else-if="!periodo_actual.activo && periodo_actual.nombre != ''">
        El periodo {{ periodo_actual.nombre }} No se encuentra activo
        <a :href="'/administracion/periodo/' + periodo_actual._id" style="margin-left:2em; margin-top:-0.4em;" class="btn-small waves-effect btn-flat white">Editar Periodo</a>
      </span>
      <span style="margin-left:2em; margin-right:2em;" v-else>
        No hay periodos configurados <a href="/administracion/agregar-periodo" style="margin-left:2em; margin-top:-0.4em;" class="btn-small waves-effect btn-flat white">Agregar uno</a>
      </span>
  </footer>
</template>

<script>
import M from "materialize-css"
import {store, api_url} from "./main"
export default {
  name: "App",
  mounted () {
    document.title = "Sistema de Administración y Gestión Escolar de El Colegio de Morelos SAGECOM"
    this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
    this.islogged()
    M.AutoInit()
    var tooltips = document.querySelectorAll('.tooltipped')
    M.Tooltip.init(tooltips, { position: 'bottom' } )

    if(this.logged_in){
      this.obtenerPeriodoActual()
    }
    
  },
  methods: {
    islogged(){
      if(this.logged_in){
        var dropdowns = this.$refs.sessionButton
        M.Dropdown.init(dropdowns, { closeOnClick: true, constrainWidth: false })
      }
    },
    cerrarSesion(){
      store.commit('logout')
    },
    async obtenerPeriodoActual(){
      await fetch(api_url + '/administracion/periodos/actual', {
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
          if(response.periodo != undefined && response.periodo.nombre != undefined){
            this.periodo_actual = response.periodo
          }
        })
      }).finally(() => {this.request_finished=true;})
    }
  },
  data(){
    return {
      logged_in: false,
      request_finished: false,
      uname: store.state.user.name,
      foto: store.state.user.foto,
      periodo_actual: {
        nombre: '',
        inicio: '',
        cierre: '',
        descripcion: '',
        activo: false
      }
    }
  }
};
</script>
<style>
#app{
  min-height: 100hv !important;
  height:auto !important;
}
.blue-colegio{
  background-color: #048FD4 !important;
}
.mid-gray-colegio{
  background-color: #64646C !important;
}
.gray-colegio{
  background-color: #83848A !important;
}
.dark-colegio{
  background-color: #060606 !important;
}
.text-center{
  text-align: center!important;
}
body, html, #app{
  background-color: #f0f0f0 !important;
}
.container{
  background-color: #ffffff;
  margin-bottom: 5em !important;
  height: auto !important;
} .container-fluid{
  margin-bottom: 4em !important;
}
.mt-1{
    margin-top: 0.25em !important;
}
.mt-2{
    margin-top: 0.5em !important;
}
.mt-3{
    margin-top: 1em !important;
}
.mt-4{
    margin-top: 1.5em !important;
}
.mt-5{
    margin-top: 2em !important;
}
.page-footer{
  position: fixed;
  text-align: center;
  bottom:0em;
  width: 100%;
  min-height:50px;
  padding-top: 1em !important;
  z-index: 10000 !important;
}
.unselectable{
  user-select: none !important;
}
</style>