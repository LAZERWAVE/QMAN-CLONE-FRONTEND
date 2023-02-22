<template>
  <div id="main-container"
       v-if="additionalClass !== null">

    <md-dialog :md-active.sync="showDialog">

      <md-dialog-title>Update Extra Class</md-dialog-title>

      <div class="form">

        <md-datepicker v-model="selectedDate" :md-disabled-dates="disabledDates"/>

        <md-field>
          <label>Shift</label>
          <md-input v-model="shift" required type="number"></md-input>
        </md-field>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="updateAdditionalClass()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-class-card md-primary"
             v-if="this.additionalClass.length === 0">
      NO ADDITIONAL CLASS DATA
    </md-card>

    <md-card class="class-card md-primary"
             v-for="aClass in additionalClass"
             :key="aClass.additionalClassID">

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
        <div>Assistant 1 : {{ aClass.assistantInitial1 }}</div>
        <div>Assistant 2 : {{ aClass.assistantInitial2 }}</div>
      </md-card-content>

      <md-card-expand>

        <md-card-actions md-alignment="space-between">

          <md-card-expand-trigger>
            <md-button id="view-button" class="md-raised">
              View Participant ({{ aClass.additionalClassDetails.length }})
            </md-button>
          </md-card-expand-trigger>

          <div v-if="!aClass.done">
            <md-button id="update-button" class="md-raised"
                       v-on:click="openUpdateDialog(aClass.additionalClassID ,aClass.shift, aClass.date)">
              Update
            </md-button>
            <md-button id="mark-button" class="md-raised"
                       v-on:click="updateAdditionalClassDone(aClass.additionalClassID, true)">
              Mark as Done
            </md-button>
            <md-button id="delete-button" class="md-raised"
                       v-on:click="deleteAdditionalClass(aClass.additionalClassID, aClass.courseSubject, aClass.class)">
              Cancel
            </md-button>
          </div>

          <div v-if="aClass.done">
            <md-button id="unmark-button" class="md-raised"
                       v-on:click="updateAdditionalClassDone(aClass.additionalClassID, false)">
              Mark as Undone
            </md-button>
          </div>

        </md-card-actions>

        <md-card-expand-content>
          <md-card-content class="participant">
            <div v-if="aClass.additionalClassDetails.length === 0">No Participants Yet</div>
            <div v-for="detail in aClass.additionalClassDetails" :key="detail.additionalClassDetailID">
              {{ detail.studentNIM }} - {{ detail.studentName }}
            </div>
          </md-card-content>
        </md-card-expand-content>

      </md-card-expand>

    </md-card>

  </div>

</template>

<script>
import {
  additionalClass,
  deleteAdditionalClass,
  updateAdditionalClass,
  updateAdditionalClassDone,
} from "@/gql/additionalClass";

import {decryptSession} from "@/utils/sessionHandler";
import {validURL} from "@/utils/urlHandler";
import {disabledDates, formatDate, formatDateReturn, getFullFormatDate} from "@/utils/dateHandler";

export default {
  name: "AssistantExtraClassTab",
  data: () => ({
    additionalClass: null,

    showDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    selectedID: "",
    selectedDate: new Date(),
    shift: "",

    validURL,
    disabledDates,
    formatDate,
    formatDateReturn,
  }),
  mounted() {
    this.$apollo.query({
      query: additionalClass,
      fetchPolicy: "no-cache",
      variables: {
        SelectAdditionalClass: {
          assistantInitial: JSON.parse(decryptSession(localStorage.getItem("session")) === "" ?
              "{}" : decryptSession(localStorage.getItem("session"))).initial,
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
      this.additionalClass = data.data.additionalClass;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    openUpdateDialog(id, shift, date) {
      this.selectedID = id;
      this.shift = shift;
      this.selectedDate = this.formatDateReturn(date);
      this.showDialog = true;
    },
    updateAdditionalClass() {
      this.$apollo.mutate({
        mutation: updateAdditionalClass,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
          UpdateAdditionalClassInput: {
            date: getFullFormatDate(this.selectedDate),
            shift: parseInt(this.shift),
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        for (let i = 0; i < this.additionalClass.length; i++) {
          if (this.additionalClass[i].additionalClassID === data.data.updateAdditionalClass.additionalClassID) {
            this.additionalClass[i] = data.data.updateAdditionalClass;
            break;
          }
        }
        this.showDialog = false;
        this.snackbarMessage = "Update extra class success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    updateAdditionalClassDone(id, isDone) {
      this.$apollo.mutate({
        mutation: updateAdditionalClassDone,
        fetchPolicy: "no-cache",
        variables: {
          ID: id,
          UpdateAdditionalClassInput: {
            "done": isDone,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then(() => {
        for (let i = 0; i < this.additionalClass.length; i++) {
          if (this.additionalClass[i].additionalClassID === id) {
            this.additionalClass[i].done = isDone;
            break;
          }
        }
        this.snackbarMessage = "Update extra class success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    deleteAdditionalClass(id, courseSubject, class_) {
      this.$confirm({
        title: "Delete Extra Class",
        message: `Are you sure want to delete ${courseSubject} ${class_} extra class ?`,
        button: {
          yes: "Yes",
          no: "Cancel",
        },
        callback: (confirm) => {
          if (confirm) {
            this.$apollo.mutate({
              mutation: deleteAdditionalClass,
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
              for (let i = 0; i < this.additionalClass.length; i++) {
                if (this.additionalClass[i].additionalClassID === data.data.deleteAdditionalClass.additionalClassID) {
                  this.additionalClass.splice(i, 1);
                  break;
                }
              }
              this.snackbarMessage = "Delete extra class success.";
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

.class-card {
  margin: 1%;
  width: 92%;
}

.participant {
  background-color: white;
  color: #1976D2;
}

#mark-button, #unmark-button, #update-button, #view-button, #delete-button {
  color: #1976D2;
  font-weight: bold;
}

</style>
