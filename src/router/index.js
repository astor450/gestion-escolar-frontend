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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
