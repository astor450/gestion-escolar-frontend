<template>
  <nav class="white">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="@/assets/logo_colegio.png" alt=""  height="60" class="d-inline-block align-text-middle" />
      </a>
    </div>
  </nav>
  <router-view />
</template>

<script>
import M from "materialize-css"
export default {
  name: "App",
  mounted () {  M.AutoInit() },
};
</script>
<style>
#app{
  min-height: 100hv !important;
}
</style>