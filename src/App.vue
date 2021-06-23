<template>
  <nav class="white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/logo_colegio.png" alt=""  height="60" class="d-inline-block align-text-middle" />
      </a>
      <ul v-show="logged_in" class="right">
        <li>
          <a class="dropdown-trigger" style="background-color: #64646C; !important" href="#!" ref="sessionButton" data-target="dropdown1">
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
</template>

<script>
import M from "materialize-css"
import {store} from "./main"
export default {
  name: "App",
  mounted () {
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
    }
  },
  data(){
    return {
      logged_in: false,
      uname: store.state.user.name
    }
  }
};
</script>
<style>
#app{
  min-height: 100hv !important;
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
  background-color: #f5f5f5;
}
.container{
  background-color: #ffffff;
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
</style>