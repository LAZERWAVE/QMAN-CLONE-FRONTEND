<template>

  <div id="main-container"
       v-if="transactionStudent !== null">

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-course-card md-primary"
             v-if="this.transactionStudent.length === 0">
      NO TRANSACTION DATA
    </md-card>

    <md-card class="course-card md-primary"
             v-for="transaction in transactionStudent"
             v-bind:key="generateKey(transaction.courseSubject, transaction.class)">

      <md-card-header class="md-title">
        <div>{{ transaction.courseSubject }}</div>
        <div>{{ transaction.class }}</div>
      </md-card-header>

      <md-card-content>
        <div class="md-subhead">
          <div>Assistant 1 : {{ transaction.assistantInitial1 }}</div>
          <div>Assistant 2 : {{ transaction.assistantInitial2 === null ? "None" : transaction.assistantInitial2 }}</div>
        </div>
      </md-card-content>

    </md-card>

  </div>
</template>

<script>
import {transactionStudent} from "../../gql/transaction";

import {decryptSession} from "../../utils/sessionHandler";
import {generateKey} from "../../utils/keyHandler";

export default {
  name: "HomeStudentTab",
  data: () => ({
    transactionStudent: null,

    showSnackbar: false,
    snackbarMessage: "",

    generateKey,
  }),
  mounted() {
    this.$apollo.query({
      query: transactionStudent,
      variables: {
        TransactionInput: {
          semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
        },
      },
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.transactionStudent = data.data.transactionStudent;
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

.empty-course-card {
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.course-card {
  margin: 1%;
  width: 45%;
}
</style>
