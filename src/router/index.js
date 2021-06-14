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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
