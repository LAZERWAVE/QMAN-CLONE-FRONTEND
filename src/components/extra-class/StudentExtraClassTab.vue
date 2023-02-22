<template>

  <div id="main-container"
       v-if="additionalClassStudent !== null">

    <md-card class="empty-class-card md-primary"
             v-if="this.additionalClassStudent.length === 0">
      NO ADDITIONAL CLASS DATA
    </md-card>

    <md-card class="class-card md-primary"
             v-for="aClass in additionalClassStudent"
             v-bind:key="aClass.additionalClassID">

      <md-card-header>
        <div class="md-title">
          <div>{{ aClass.courseSubject }}</div>
          <div>{{ aClass.class }}</div>
        </div>
        <div>{{ formatDate(aClass.date) }} Shift {{ aClass.shift }}</div>
      </md-card-header>

      <md-card-content class="md-subhead">
        <div>Assistant 1: {{ aClass.assistantInitial1 }}</div>
        <div>Assistant 2: {{ aClass.assistantInitial2 }}</div>
      </md-card-content>

      <md-card-actions>
        <md-button id="join-button" class="md-raised" v-on:click="joinAdditionalClass(aClass.additionalClassID)">Join
        </md-button>
      </md-card-actions>

    </md-card>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

  </div>

</template>

<script>

import {additionalClassStudent, createAdditionalClassDetail} from "../../gql/additionalClass";

import {decryptSession} from "../../utils/sessionHandler";
import {validURL} from "../../utils/urlHandler";
import {formatDate} from "../../utils/dateHandler";

export default {
  name: "StudentParticipateExtraClassTab",
  data: () => ({
    additionalClassStudent: null,

    showSnackbar: false,
    snackbarMessage: "",

    validURL,
    formatDate,
  }),
  mounted() {
    this.$apollo.query({
      query: additionalClassStudent,
      fetchPolicy: "no-cache",
      variables: {
        SelectAdditionalClassStudent: {
          onlyStudentJoin: false,
          semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
          done: false,
        },
      },
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.additionalClassStudent = data.data.additionalClassStudent;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    joinAdditionalClass(additionalClassID) {
      this.$apollo.mutate({
        mutation: createAdditionalClassDetail,
        fetchPolicy: "no-cache",
        variables: {
          CreateAdditionalClassDetailInput: {
            additionalClassID: additionalClassID,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then(() => {
        this.$router.go(0);
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
        this.showSnackbar = true;
      });
    },
  },
};
</script>

<style scoped>

#main-container {
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  background-color: white;
}

.empty-class-card {
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.class-card {
  margin: 1%;
  width: 45%;
}

#join-button {
  color: #1976D2;
  font-weight: bold;
}

</style>
