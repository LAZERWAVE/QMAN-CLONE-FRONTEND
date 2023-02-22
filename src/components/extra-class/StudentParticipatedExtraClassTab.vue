<template>

  <div id="main-container"
       v-if="additionalClassStudent !== null">

    <md-card class="empty-class-card md-primary"
             v-if="this.additionalClassStudent.length === 0">
      NO ADDITIONAL CLASS DATA
    </md-card>

    <md-card class="md-primary"
             v-for="aClass in additionalClassStudent"
             v-bind:key="aClass.additionalClassID">

      <md-card-header>
        <div class="md-title">
          <div>{{ aClass.courseSubject }}</div>
          <div>{{ aClass.class }}</div>
        </div>
        <div>{{ formatDate(aClass.date) }} Shift {{ aClass.shift }}</div>
        <div v-if="validURL(aClass.location)">Location:
          <md-chip><a v-bind:href=aClass.location target="_blank">Zoom Link</a></md-chip>
          <md-tooltip md-direction="bottom">{{ aClass.location }}</md-tooltip>
        </div>
        <div v-if="!validURL(aClass.location)">Location :
          <md-chip class="chips" md-static>Room {{ aClass.location }}</md-chip>
        </div>
      </md-card-header>

      <md-card-content class="md-subhead">
        <div>Assistant 1: {{ aClass.assistantInitial1 }}</div>
        <div>Assistant 2: {{ aClass.assistantInitial2 }}</div>
      </md-card-content>

    </md-card>

  </div>

</template>

<script>
import {decryptSession} from "@/utils/sessionHandler";

import {additionalClassStudent} from "@/gql/additionalClass";

import {validURL} from "@/utils/urlHandler";
import {formatDate} from "@/utils/dateHandler";

export default {
  name: "StudentParticipatedExtraClassTab",
  data: () => ({
    additionalClassStudent: [],

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
          onlyStudentJoin: true,
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

/*Important do not erase*/
.md-card {
  margin: 1%;
  width: 45%;
}

.class-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

a, .chips {
  color: white !important;
  text-decoration: none;
  font-weight: bold;
}

.empty-class-card {
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

</style>
