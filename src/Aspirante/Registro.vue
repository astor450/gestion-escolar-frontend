<template>
<div class="valign-wrapper">
  <main class="card z-depth-3 center-align mt-5">
    <form class="valign">
      <h4 class="mt-5">Aspirantes de El colegio de Morelos</h4>
      <div class="row">
        <div class="input-field col s12">
          <input id="curp" v-model="curp" name="curp" type="text" class="validate">
          <label for="curp">CURP (18 dígitos)</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="clave" v-model="clave" type="password" class="validate">
          <label for="clave">Contraseña</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="repetir-clave" v-model="repetirClave" type="password" class="validate">
          <label for="repetir-clave">Repetir Contraseña</label>
        </div>
      </div>
      <button class="w-100 btn btn-lg btn-primary waves-effect" @click.prevent="enviarRegistro">Iniciar Registro</button>
      <div class="card-action">
        <router-link to="login">Iniciar Sesión</router-link>
      </div>
    </form>
  </main>
</div>
</template>

<script>
import M from "materialize-css"
import {api_url, curpValida} from '../main'
export default {
  mounted () {
    
  },
  methods:{
    async enviarRegistro(){
      try {
        if(!curpValida(this.curp))
          throw 'CURP inválida'
        if(this.clave.trim().length == 0)
          throw 'Debe escribir una contraseña'
        if(this.clave !== this.repetirClave)
          throw 'Las contraseñas deben coincidir'

        await fetch(api_url + '/aspirante/registro', {
          method: 'POST',
          body: JSON.stringify({
            curp: this.curp,
            clave: this.clave
          }),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then((request)=>{
          request.json().then((response) => {
            
            if(response.status !== 'success'){
              M.toast({ html: response.message, classes: 'red darken-2'})
            } else {
              M.toast({ html: response.message, classes: 'green darken-2'})
            }
          })
        })
        
      } catch (error) {
        M.toast({ html: error, classes: 'red darken-2' })
        return false
      }
    },
  },
  data() {
    return {
      curp: "",
      clave: "",
      repetirClave: ""
    }
  }
};
</script>

<style>
html {
    height: 100%;
}
body{
  background-color: #ffffff;
}
.valign-wrapper{
  height: 100vh;
  margin-top: -4.4em;
}
.card {
  width: 100%;
  max-width: 500px;
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
}
.card-action{
  margin-top:1em;
}
.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.my-wrapper {
  height: 100%;
}
</style>
