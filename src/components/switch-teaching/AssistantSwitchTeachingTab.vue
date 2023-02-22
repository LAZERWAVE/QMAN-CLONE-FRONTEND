<template>

  <div id="main-container"
       v-if="switchTeaching !== null">

    <md-dialog :md-active.sync="showDialog">

      <md-dialog-title>Update Switch Teaching</md-dialog-title>

      <div class="form">

        <md-datepicker v-model="selectedDate"/>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="updateSwitchTeaching()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-switch-card md-primary"
             v-if="this.switchTeaching.length === 0">
      NO SWITCH TEACHING DATA
    </md-card>

    <md-card class="switch-card md-primary"
             v-for="schedule in switchTeaching"
             :key="schedule.switchTeachingID">

      <md-card-header>
        <md-card-header-text>
          <div class="md-title">
            <div>{{ schedule.courseSubject }}</div>
            <div>{{ schedule.class }}</div>
          </div>
          <div> {{ formatDate(schedule.date) }} Shift {{ schedule.shift }}</div>
          <div> Session : {{ schedule.session }}</div>
        </md-card-header-text>
      </md-card-header>

      <md-card-content class="md-subhead">
        <div>{{ schedule.assistantFrom }} Substituted By {{ schedule.assistantTo }}</div>
      </md-card-content>

      <md-card-actions md-alignment="right">
        <md-button id="update-button" class="md-raised"
                   v-if="!schedule.approved"
                   v-on:click="openDialog(schedule.switchTeachingID, schedule.date)">
          Update
        </md-button>
        <md-button id="cancel-button" class="md-raised"
                   v-if="!schedule.approved"
                   v-on:click="deleteSwitchTeaching(schedule.switchTeachingID, schedule.assistantFrom,
                   schedule.assistantTo)">
          Cancel
        </md-button>
        <md-chip id="joined-chip"
                 v-if="schedule.approved">
          Approved
        </md-chip>
      </md-card-actions>

    </md-card>

  </div>

</template>

<script>
import {deleteSwitchTeaching, switchTeaching, updateSwitchTeaching} from "@/gql/switchTeaching";

import {decryptSession} from "@/utils/sessionHandler";
import {formatDate, formatDateReturn} from "@/utils/dateHandler";

export default {
  name: "SwitchTeachingTab",
  data: () => ({
    switchTeaching: null,

    showDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    selectedID: "",
    selectedDate: new Date(),

    formatDate,
    formatDateReturn,
  }),
  mounted() {
    this.$apollo.query({
      query: switchTeaching,
      fetchPolicy: "no-cache",
      variables: {
        SelectSwitchTeaching: {
          semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
          assistant: JSON.parse(decryptSession(localStorage.getItem("session")) === "" ?
              "{}" : decryptSession(localStorage.getItem("session"))).initial,
        },
      },
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.switchTeaching = data.data.switchTeaching;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    openDialog(id, date) {
      this.selectedID = id;
      this.selectedDate = this.formatDateReturn(date);
      this.showDialog = true;
    },
    updateSwitchTeaching() {
      this.$apollo.mutate({
        mutation: updateSwitchTeaching,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
          UpdateSwitchTeachingInput: {
            date: this.selectedDate,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        for (let i = 0; i < this.switchTeaching.length; i++) {
          if (this.switchTeaching[i].switchTeachingID === data.data.updateSwitchTeaching.switchTeachingID) {
            this.switchTeaching[i] = data.data.updateSwitchTeaching;
            break;
          }
        }
        this.showDialog = false;
        this.snackbarMessage = "Update switch teaching success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    deleteSwitchTeaching(id, assistantFrom, assistantTo) {
      this.$confirm({
        title: "Delete Switch Teaching",
        message: `Are you sure want to delete ${assistantFrom} and ${assistantTo} switch teaching ?`,
        button: {
          yes: "Yes",
          no: "Cancel",
        },
        callback: (confirm) => {
          if (confirm) {
            this.$apollo.mutate({
              mutation: deleteSwitchTeaching,
              fetchPolicy: "no-cache",
              variables: {
                ID: id,
              },
              context: {
                headers: {
                  authorization: decryptSession(localStorage.getItem("authorization-token")),
                },
              },
            }).then((data) => {
              for (let i = 0; i < this.switchTeaching.length; i++) {
                if (this.switchTeaching[i].switchTeachingID === data.data.deleteSwitchTeaching.switchTeachingID) {
                  this.switchTeaching.splice(i, 1);
                  break;
                }
              }
              this.snackbarMessage = "Delete switch teaching success.";
            }).catch((error) => {
              this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
            }).finally(() => {
              this.showSnackbar = true;
            });
          }
        },
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

.empty-switch-card {
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.switch-card {
  margin: 1%;
  width: 45%;
}

#update-button, #cancel-button, #joined-chip {
  color: #1976D2;
  font-weight: bold;
}

#joined-chip {
  background-color: white
}

</style>
