import Vue from "vue";
import VueRouter from "vue-router";

import LoginAssistantPage from "@/views/authentication/LoginAssistantPage";
import LoginStudentPage from "@/views/authentication/LoginStudentPage";
import Home from "@/views/home/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/", redirect: "/login/Student",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      title: "Home Page | Involvement Web App",
    },
  },
  {
    path: "/login/Assistant",
    name: "LoginAssistant",
    component: LoginAssistantPage,
    meta: {
      title: "Login Assistant Page | Involvement Web App",
    },
  },
  {
    path: "/login/Student",
    name: "LoginStudent",
    component: LoginStudentPage,
    meta: {
      title: "Login Student Page | Involvement Web App",
    },
  },
  {
    path: "*",
    name: "LoginStudentFor404",
    component: LoginStudentPage,
    meta: {
      title: "Login Student Page | Involvement Web App",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  base: "qman",
});

export default router;
