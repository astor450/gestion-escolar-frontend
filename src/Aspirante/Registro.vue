<template>
<div class="valign-wrapper">
  <main class="card z-depth-3 center-align mt-5">
    <form class="valign">
      <h4 class="mt-5">Aspirantes de El colegio de Morelos</h4>
      <div class="row">
        <div class="input-field col s12">
          <input id="curp" name="curp" type="text" class="validate">
          <label for="curp">CURP (18 dígitos)</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="clave" type="password" class="validate">
          <label for="clave">Contraseña</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="repetir-clave" type="password" class="validate">
          <label for="repetir-clave">Repetir Contraseña</label>
        </div>
      </div>
      <button class="w-100 btn btn-lg btn-primary waves-effect" type="submit">Iniciar Registro</button>
      <div class="card-action">
        <router-link to="login">Iniciar Sesión</router-link>
      </div>
    </form>
  </main>
</div>
</template>

<script>
export default {};
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
