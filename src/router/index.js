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
      import(/* webpackChunkName: "HomeAspirante" */ "../Administracion/Alumnos/Index.vue")
  },
  {
    path: "/administracion/login",
    name: "AdmonLogin",
    component: () =>
      import(/* webpackChunkName: "HomeAspirante" */ "../Administracion/Login.vue")
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
