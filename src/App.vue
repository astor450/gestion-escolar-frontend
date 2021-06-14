<template>
  <nav class="white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/logo_colegio.png" alt=""  height="60" class="d-inline-block align-text-middle" />
      </a>
      <ul v-show="logged_in" class="right">
        <li>
          <a class="dropdown-trigger blue" href="#!" ref="sessionButton" data-target="dropdown1">
            {{ uname }} <i class="material-icons right">arrow_drop_down</i>
          </a>
        </li>
      </ul>
      <ul v-show="logged_in" id='dropdown1' class='dropdown-content'>
        <li><a href="#!" @click.prevent="cerrarSesion"><i class="material-icons">logout</i>Cerrar sesión</a></li>
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
  },
  methods: {
    islogged(){
      if(this.logged_in){
        var dropdowns = this.$refs.sessionButton
        console.log(dropdowns)
        M.Dropdown.init(dropdowns, { closeOnClick: true })
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
</style>