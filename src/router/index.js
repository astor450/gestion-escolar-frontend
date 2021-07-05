import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/aspirante/login",
    name: "LoginAspirante",
    component: () =>
      import(/* webpackChunkName: "loginAspirante" */ "../Aspirante/Login.vue"),
  },
  {
    path: "/aspirante/registro",
    name: "RegistroAspirante",
    component: () =>
      import(/* webpackChunkName: "RegistroAspirante" */ "../Aspirante/Registro.vue"),
  },
  {
    path: "/aspirante",
    name: "HomeAspirante",
    component: () =>
      import(/* webpackChunkName: "HomeAspirante" */ "../Aspirante/Index.vue"),
  },
  {
    path: "/administracion/alumnos",
    name: "AdmonAlumnos",
    component: () =>
      import(/* webpackChunkName: "AlumnosAdministracion" */ "../Administracion/Alumnos/Index.vue")
  },
  {
    path: "/administracion/login",
    name: "AdmonLogin",
    component: () =>
      import(/* webpackChunkName: "LoginAdministracion" */ "../Administracion/Login.vue")
  },
  {
    path: "/administracion/",
    name: "AdmonIndex",
    component: () =>
      import(/* webpackChunkName: "HomeAdministracion" */ "../Administracion/Index.vue")
  },
  {
    path: "/administracion/alumnos/",
    name:"ListaAlumnos",
    component: () =>
      import(/* webpackChunkName: "ListadoAlumnos" */ "../Administracion/Alumnos/Index.vue")
  },
  {
    path: "/administracion/nuevo-alumno/",
    name:"NuevoAlumno",
    component: () =>
      import(/* webpackChunkName: "NuevoAlumno" */ "../Administracion/Alumnos/Agregar.vue")
  },
  {
    path: "/administracion/aspirantes",
    name:"ListaAspirantes",
    component: () =>
      import(/* webpackChunkName: "ListadoAspirantes" */ "../Administracion/Aspirantes/Index.vue")
  },
  {
    path: "/administracion/aspirante/:id",
    name:"VistaAspirante",
    component: () =>
      import(/* webpackChunkName: "VistaAspirante" */ "../Administracion/Aspirantes/Aspirante.vue")
  },
  {
    path: "/administracion/usuarios",
    name:"ListaUsuarios",
    component: () =>
      import(/* webpackChunkName: "ListadoUsuarios" */ "../Administracion/Usuarios/Index.vue")
  },
  {
    path: "/administracion/nuevo-usuario",
    name:"NuevoUsuario",
    component: () =>
      import(/* webpackChunkName: "NuevoUsuario" */ "../Administracion/Usuarios/Agregar.vue")
  },
  {
    path: "/administracion/areas",
    name:"Areas",
    component: () =>
      import(/* webpackChunkName: "Areas" */ "../Administracion/Areas/Index.vue")
  },
  {
    path: "/administracion/asignaturas",
    name:"ListarAsignaturas",
    component: () =>
      import(/* webpackChunkName: "ListadoAsignaturas" */ "../Administracion/Asignaturas/Index.vue")
  },
  {
    path: "/administracion/nueva-asignatura",
    name:"NuevaAsignatura",
    component: () =>
      import(/* webpackChunkName: "NuevaAsignatura" */ "../Administracion/Asignaturas/Agregar.vue")
  },
  {
    path: "/administracion/periodos",
    name:"ListarPeriodos",
    component: () =>
      import(/* webpackChunkName: "ListadoPeriodos" */ "../Administracion/Periodos/Index.vue")
  },
  {
    path: "/administracion/agregar-periodo",
    name:"NuevoPeriodo",
    component: () =>
      import(/* webpackChunkName: "NuevoPeriodo" */ "../Administracion/Periodos/Agregar.vue")
  },
  {
    path: "/administracion/periodo/:id",
    name:"VistaPeriodo",
    component: () =>
      import(/* webpackChunkName: "VistaPeriodo" */ "../Administracion/Periodos/Periodo.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
