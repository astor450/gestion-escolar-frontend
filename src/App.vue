<template>
  <nav class="white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/logo_colegio.png" alt=""  height="60" class="d-inline-block align-text-middle" />
      </a>
      <ul v-show="logged_in" class="right">
        <li>
          <a class="dropdown-trigger" style="background-color: #64646C; !important" href="#!" ref="sessionButton" data-target="dropdown1">
            <img class="left mt-2" :src="foto == '' ? require('@/assets/user_placeholder.png') : $store.state.user.foto" style="height:40px;"/> &nbsp;
            {{ $store.state.user.name }} <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
      </ul>
      <ul v-show="logged_in" id='dropdown1' class='dropdown-content'>
        <li><a href="#!" @click.prevent="cerrarSesion">Cerrar sesión</a></li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<script>
import M from "materialize-css"
import { store } from "./main"
export default {
  name: "App",
  mounted () {
    document.title = "Sistema de Administración y Gestión Escolar de El Colegio de Morelos SAGECOM"
    this.logged_in = store.state.user.token != "" && localStorage.getItem('token') != null
    this.islogged()
    M.AutoInit()
    var tooltips = document.querySelectorAll('.tooltipped')
    M.Tooltip.init(tooltips, { position: 'bottom' } )
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
    
  },
  data(){
    return {
      logged_in: store.state.user !== "" || store.state.user !== undefined,
      request_finished: false,
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
  background-color: #9395a0 !important;
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
body::-webkit-scrollbar {
  width: 10px;
  background-color: #F5F5F5;
}
body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #9395a0 !important; 
}
body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #F5F5F5;
  border-radius: 10px; 
}
.borders-7{
  border-radius:7px !important;
}
.text-mutted {
  color: #888888 !important;
}
</style>