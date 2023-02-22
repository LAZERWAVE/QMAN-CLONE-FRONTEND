<template>

  <div id="particles-js">

    <vue-element-loading :active="showLoading"
                         spinner="bar-fade-scale"/>

    <form>

      <md-card id="main-card" md-with-hover>

        <md-card-header>
          <div class="md-title">Involvement Web App</div>
          <div class="md-subhead">Login for Software Laboratory Center</div>
        </md-card-header>

        <div id="small-card">

          <md-field>
            <label>Initial and Generation</label>
            <md-input v-model="initial" autocomplete="on" required/>
          </md-field>

          <md-field>
            <label>Password</label>
            <md-input type="password" v-model="password" v-on:keydown.enter="loginAction"
                      autocomplete="on" required/>
          </md-field>

          <div id="remember-div">
            <md-checkbox class="md-primary" v-model="rememberMe">Remember Me</md-checkbox>
          </div>

        </div>

        <md-card-actions>
          <md-button v-on:click="loginAction">Login</md-button>
        </md-card-actions>

      </md-card>

      <md-snackbar :md-active.sync="showSnackbar" md-persistent>
        <span>{{ snackbarMessage }}</span>
        <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
      </md-snackbar>

    </form>

  </div>

</template>

<script>
import router from "@/router";

import {particlesJSON} from "./particles/particlesJSON.js";
import particleJS from "./particles/particles.js";

import {getSemester} from "@/gql/semester";
import {loginAssistant} from "@/gql/login";

import {EncryptToBase64} from "@/utils/encryptionHandler";

import {encryptSession, checkDecryptLocalStorage, resetLocalStorage} from "@/utils/sessionHandler";

export default {
  name: "LoginAssistantPage",
  data: () => ({
    getSemester: [],

    showLoading: false,
    showSnackbar: false,
    snackbarMessage: "",

    initial: "",
    password: "",
    rememberMe: false,
  }),
  mounted: function() {
    try {
      if (!checkDecryptLocalStorage()) {
        router.push("/home");
      }
    } catch (err) {
      resetLocalStorage();
    }

    this.$apollo.query({
      query: getSemester,
      fetchPolicy: "no-cache",
    }).then((getSemester) => {
      this.getSemester = getSemester.data.getSemester;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });

    particleJS;
    window.particlesJS("particles-js", particlesJSON);

    this.initial = (this.$cookie.get("initial") != null) ? this.$cookie.get("initial") : "";
    this.password = (this.$cookie.get("password") != null) ? this.$cookie.get("password") : "";
  },
  methods: {
    loginAction() {
      if (this.initial.length === 0 || this.password.length === 0) {
        return;
      }

      this.showLoading = true;

      // eslint-disable-next-line new-cap
      const encryptedPassword = EncryptToBase64(this.initial.toLowerCase(), this.password);

      this.$apollo.query({
        query: loginAssistant,
        fetchPolicy: "no-cache",
        variables: {
          LoginInput: {
            username: this.initial,
            password: encryptedPassword,
          },
        },
      }).then((data) => {
        if (data.data !== null) {
          const authorizationToken = data.data.loginAssistant.accessToken;
          const messierToken = data.data.loginAssistant.accessTokenMessier;
          const expires = data.data.loginAssistant.expires;

          const session = {};
          session.initial = this.initial.toUpperCase();
          session.role = data.data.loginAssistant.type;
          const sessionJSON = JSON.stringify(session);

          const semester = {};
          semester.semesterID = this.getSemester[0].semesterID;
          semester.semesterDescription = this.getSemester[0].description;
          const semesterJSON = JSON.stringify(semester);

          localStorage.setItem("authorization-token", encryptSession(authorizationToken));
          localStorage.setItem("messier-token", encryptSession(messierToken));
          localStorage.setItem("expires-token", encryptSession(expires));
          localStorage.setItem("session", encryptSession(sessionJSON));
          localStorage.setItem("semester", encryptSession(semesterJSON));

          if (this.rememberMe) {
            this.$cookie.set("initial", this.initial, {expires: "30m"});
            this.$cookie.set("password", this.password, {expires: "30m"});
          }

          router.push("/home");
        }
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
        this.showSnackbar = true;
      }).finally(() => {
        this.showLoading = false;
      });
    },
  },
};
</script>

<style scoped>
#particles-js {
  height: 100vh;
}

#main-card {
  width: 30%;
  height: inherit;

  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
}

#small-card {
  padding: 0 7.5%;
}

#remember-div {
  display: flex;
  justify-content: flex-start;
}

@media only screen and (max-width: 800px) {
  #main-card {
    width: inherit;
    height: inherit;
  }
}
</style>
