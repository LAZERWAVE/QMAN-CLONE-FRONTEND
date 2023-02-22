/**
 * Plugins
 */
// ==================
// = Import Plugins =
// ==================
import "@babel/polyfill";
import "mutationobserver-shim";
import "vue-awesome/icons";
import "vue-awesome/icons/flag";
import "vue-material/dist/theme/default.css";
import "vue-material/dist/vue-material.min.css";
import "./plugins/vue-bootstrap";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import Vuelidate from "vuelidate";
import ChartKick from "vue-chartkick";
import Chart from "chart.js";
import Icon from "vue-awesome/components/Icon";
import DisableAutocomplete from "vue-disable-autocomplete";
import LoadScript from "vue-plugin-load-script";
import VueConfirmDialog from "vue-confirm-dialog";
import VueElementLoading from "vue-element-loading";
import VueParticles from "vue-particles";
import VueMaterial from "vue-material";
import vSelect from "vue-select";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
// ==================

// ===============
// = Use Plugins =
// ===============
Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(VueConfirmDialog);
Vue.use(VueMaterial);
Vue.use(VueParticles);
Vue.use(LoadScript);
Vue.use(DisableAutocomplete);
Vue.use(ChartKick.use(Chart));
Vue.use(require("vue-cookie"));

Vue.component("v-icon", Icon);
Vue.component("v-select", vSelect);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("VueElementLoading", VueElementLoading);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);
// ===============


/**
 * Components
 */
// =====================
// = Import Components =
// =====================
import App from "./App.vue";
import HomeNavigation from "@/components/main/HomeNavigation.vue";
import AssistantHomeTab from "@/components/home/AssistantHomeTab";
import StudentProfileTab from "@/components/profile/StudentProfileTab";
import SwitchTeachingTab from "@/components/switch-teaching/AssistantSwitchTeachingTab";
import OfficerPetitionTab from "@/components/petition/OfficerPetitionTab";
import AssistantProfileTab from "@/components/profile/AssistantProfileTab";
import OfficerManageExtraClassTab from "@/components/extra-class/OfficerManageExtraClassTab";
import StudentParticipateExtraClassTab from "@/components/extra-class/StudentExtraClassTab";
import AssistantExtraClassTab from "@/components/extra-class/AssistantExtraClassTab";
import AssistantPetitionTab from "@/components/petition/AssistantPetitionTab";
import AssistantInvolvementTab from "@/components/involvement/AssistantInvolvementTab";
import StudentHomeTab from "@/components/home/StudentHomeTab";
import OfficerManageSwitchTeaching from "@/components/switch-teaching/OfficerManageSwitchTeaching";
import StudentParicipatedExtraClass from "@/components/extra-class/StudentParticipatedExtraClassTab";
import OfficerManageInvolvementTab from "@/components/involvement/OfficerManageInvolvementTab";
// =====================

// ==================
// = Use Components =
// ==================
Vue.component("app-home-navigation", HomeNavigation);
Vue.component("app-assistant-home-tab", AssistantHomeTab);
Vue.component("app-student-home-tab", StudentHomeTab);
Vue.component("app-assistant-profile-tab", AssistantProfileTab);
Vue.component("app-student-profile-tab", StudentProfileTab);
Vue.component("app-officer-manage-extra-class-tab", OfficerManageExtraClassTab);
Vue.component("app-student-participate-extra-class-tab", StudentParticipateExtraClassTab);
Vue.component("app-officer-petition-tab", OfficerPetitionTab);
Vue.component("app-assistant-extra-class-tab", AssistantExtraClassTab);
Vue.component("app-assistant-petition-tab", AssistantPetitionTab);
Vue.component("app-switch-teaching-tab", SwitchTeachingTab);
Vue.component("app-assistant-involvement-tab", AssistantInvolvementTab);
Vue.component("app-officer-manage-switch-teaching-tab", OfficerManageSwitchTeaching);
Vue.component("app-student-participated-extra-class-tab", StudentParicipatedExtraClass);
Vue.component("app-officer-manage-involvement-tab", OfficerManageInvolvementTab);
// ==================


/**
 * Vue Instance
 */
// ============================================
// = Suppress Error (Bad Input) for Md-Select =
// ============================================
Vue.config.errorHandler = (err, vm, info) => {
  if (err.message !== "Cannot read property 'badInput' of undefined") {
    console.error(err);
  }
};
// ============================================

// ==============================
// = Import Router and Provider =
// ==============================
import router from "./router";
import {createProvider} from "./plugins/vue-apollo";
// ==============================

// =======================
// = Create Vue Instance =
// =======================
new Vue({
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
// =======================
