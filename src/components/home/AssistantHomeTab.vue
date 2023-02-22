<template>

  <div id="main-container">

    <md-dialog :md-active.sync="showCreateSwitchDialog">

      <md-dialog-title>Create Substitute</md-dialog-title>

      <div class="form">

        <md-field>
          <label>Substitute Initial</label>
          <md-input v-model="partner" required></md-input>
        </md-field>

        <md-datepicker v-model="selectedDate" md-immediately :md-disabled-dates="disabledDates"/>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showCreateSwitchDialog = false">Close</md-button>
        <md-button class="md-primary" @click="createSwitchTeaching()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-dialog :md-active.sync="showCreateClassDialog">

      <md-dialog-title>Create Extra Class</md-dialog-title>

      <div class="form">

        <md-field>
          <label>Partner Initial</label>
          <md-input v-model="partner" required></md-input>
        </md-field>

        <md-field>
          <label>Location</label>
          <md-input v-model="location" required></md-input>
        </md-field>

        <md-datepicker v-model="selectedDate" md-immediately :md-disabled-dates="disabledDates"/>

        <md-field>
          <label>Shift</label>
          <md-input v-model="shift" required type="number"></md-input>
        </md-field>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showCreateClassDialog = false">Close</md-button>
        <md-button class="md-primary" @click="createExtraClass()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-course-card md-primary"
             v-if="this.transactionAssistant.length === 0">
      NO TRANSACTION DATA
    </md-card>

    <md-card class="course-card md-primary"
             v-for="transaction in this.transactionAssistant"
             :key="generateKey(transaction.courseSubject,transaction.class)">

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

      <md-card-actions md-alignment="right">
        <md-button id="substitute-button" class="md-raised"
                   v-on:click="openCreateSwitchDialog(transaction.courseSubject, transaction.class)">
          Substitute
        </md-button>
        <md-button id="create-button" class="md-raised"
                   v-on:click="openCreateClassDialog(transaction.courseSubject,
                   transaction.assistantInitial2.trim() === initial ?
                   transaction.assistantInitial1 : transaction.assistantInitial2, transaction.class)">
          Create Extra Class
        </md-button>
      </md-card-actions>

    </md-card>

  </div>

</template>

<script>
import {transactionAssistant} from "@/gql/transaction";
import {createAdditionalClass} from "@/gql/additionalClass";
import {createSwitchTeaching} from "@/gql/switchTeaching";

import {decryptSession} from "@/utils/sessionHandler";
import {disabledDates, getFullFormatDate} from "@/utils/dateHandler";
import {generateKey} from "@/utils/keyHandler";

export default {
  name: "HomeAssistantTab",
  data: () => ({
    transactionAssistant: [],

    showCreateClassDialog: false,
    showCreateSwitchDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    initial: JSON.parse(decryptSession(localStorage.getItem("session")) === "" ?
        "{}" : decryptSession(localStorage.getItem("session"))).initial,

    selectedDate: new Date(),
    courseSubject: "",
    partner: "",
    shift: "",
    class_: "",
    location: "",

    disabledDates,
    generateKey,
  }),
  mounted() {
    this.$apollo.query({
      query: transactionAssistant,
      fetchPolicy: "no-cache",
      variables: {
        TransactionAssistantInput: {
          "semesterID": JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
        },
      },
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.transactionAssistant = data.data.transactionAssistant;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    openCreateClassDialog(courseSubject, partner, class_) {
      this.courseSubject = courseSubject;
      this.selectedDate = new Date();
      this.class_ = class_.trim();
      this.partner = partner;
      this.shift = "";
      this.location = "";
      this.showCreateClassDialog = true;
    },
    openCreateSwitchDialog(courseSubject, class_) {
      this.courseSubject = courseSubject;
      this.selectedDate = new Date();
      this.class_ = class_.trim();
      this.partner = "";
      this.shift = "";
      this.showCreateSwitchDialog = true;
    },
    createExtraClass() {
      this.showCreateClassDialog = false;

      this.$apollo.mutate({
        mutation: createAdditionalClass,
        fetchPolicy: "no-cache",
        variables: {
          CreateAdditionalClassInput: {
            semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
                "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
            courseSubject: this.courseSubject,
            assistantInitial2: this.partner,
            date: getFullFormatDate(this.selectedDate),
            shift: parseInt(this.shift),
            location: this.location,
            class: this.class_,
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
    createSwitchTeaching() {
      this.showCreateSwitchDialog = false;

      this.$apollo.mutate({
        mutation: createSwitchTeaching,
        fetchPolicy: "no-cache",
        variables: {
          CreateSwitchTeachingInput: {
            semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
                "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
            courseSubject: this.courseSubject,
            assistantTo: this.partner,
            class: this.class_,
            date: getFullFormatDate(this.selectedDate),
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

.form {
  padding: 0 10%;
  width: 40vw;
}

#create-button, #substitute-button {
  font-weight: bold;
  color: #448aff;
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
