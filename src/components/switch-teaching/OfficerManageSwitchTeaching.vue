<template>
  <div id="main-container"
       v-if="switchTeaching !== null && getCourseSubject !== null">

    <md-dialog :md-active.sync="showCreateSwitchDialog">

      <md-dialog-title>Substitute Details</md-dialog-title>

      <md-dialog-content class="form">

        <md-field>
          <label>Course Subject</label>
          <md-select v-model="courseSubject" required>
            <md-option v-for="course in getCourseSubject"
                       v-bind:key="course.courseSubjectID"
                       :value="course.courseSubjectDescription">
              {{ course.courseSubjectDescription }}
            </md-option>
          </md-select>
        </md-field>

        <md-field>
          <label>Class</label>
          <md-input v-model="class_" required></md-input>
        </md-field>

        <md-field>
          <label>Assistant From</label>
          <md-input v-model="ast" required></md-input>
        </md-field>

        <md-field>
          <label>Assistant To</label>
          <md-input v-model="ast2" required></md-input>
        </md-field>

        <md-datepicker v-model="date" md-immediately/>

      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showCreateSwitchDialog = false">Close</md-button>
        <md-button class="md-primary" @click="createSwitchTeaching()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-dialog :md-active.sync="showUpdateSwitchDialog">

      <md-dialog-title>Update Switch Teaching</md-dialog-title>

      <div class="form">

        <md-field>
          <label>Status</label>
          <md-select v-model="status" required>
            <md-option value="PERMISSION">PERMISSION</md-option>
            <md-option value="SPECIAL PERMISSION">SPECIAL PERMISSION</md-option>
            <md-option value="SUBSTITUTED">SUBSTITUTED</md-option>
            <md-option value="THIRD PERSON">THIRD PERSON</md-option>
          </md-select>
        </md-field>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showUpdateSwitchDialog = false">Close</md-button>
        <md-button class="md-primary" @click="updateSwitchTeaching()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <div id="button-container">
      <div>
        <md-button class="md-raised md-primary"
                   v-on:click="openCreateDialog()">
          Create Substitute
          <md-icon>add</md-icon>
        </md-button>
      </div>

      <div>
        <xlsx-workbook>
          <xlsx-sheet
              v-for="sheet in formatSheet()"
              :collection="sheet.data"
              :key="sheet.name"
              :sheet-name="sheet.name"/>

          <xlsx-download :filename="formatName()">
            <md-button class="md-raised md-primary">
              Export Excel
              <md-icon>file_download_done</md-icon>
            </md-button>
          </xlsx-download>
        </xlsx-workbook>
      </div>
    </div>

    <md-card class="empty-switch-card md-primary"
             v-if="this.switchTeaching.length === 0">
      NO SWITCH TEACHING DATA
    </md-card>

    <md-card class="switch-card md-primary"
             v-if="this.switchTeaching.length !== 0">

      <md-card-actions md-alignment="space-between">
        <span class="title-table">List of Switch Teaching</span>
      </md-card-actions>

      <md-table v-model="switchTeaching"
                md-sort="courseSubject"
                md-sort-order="asc"
                md-card>

        <md-table-row slot="md-table-row" slot-scope="{ item }">

          <md-table-cell md-label="Course Subject" md-sort-by="courseSubject">
            {{ item.courseSubject }}
          </md-table-cell>

          <md-table-cell md-label="Assistant From" md-sort-by="assistantFrom">
            {{ item.assistantFrom }}
          </md-table-cell>

          <md-table-cell md-label="Assistant To" md-sort-by="assistantTo">
            {{ item.assistantTo }}
          </md-table-cell>

          <md-table-cell md-label="Date" md-sort-by="date">
            {{ formatDate(item.date) }}
          </md-table-cell>

          <md-table-cell md-label="Shift" md-sort-by="shift">
            {{ item.shift }}
          </md-table-cell>

          <md-table-cell md-label="Session" md-sort-by="session">
            {{ item.session }}
          </md-table-cell>

          <md-table-cell md-label="Status" md-sort-by="status">
            {{ item.status }}
          </md-table-cell>

          <md-table-cell>
            <div style="display: flex; flex-direction: row">
              <md-button id="approve-button" style="margin: 0 2px;"
                         v-if="!item.approved"
                         v-on:click="approveSwitchTeaching(item.switchTeachingID, true)">
                <i class="fa fa-check fa-2x"></i>
              </md-button>

              <md-button id="unapprove-button" style="margin: 0 6px;"
                         v-if="item.approved"
                         v-on:click="approveSwitchTeaching(item.switchTeachingID, false)">
                <i class="fa fa-times fa-2x"></i>
              </md-button>

              <md-button id="update-button" style="margin: 0 2px;"
                         v-on:click="openUpdateDialog(item.switchTeachingID, item.assistantTo, item.status)">
                <i class="fa fa-pencil fa-2x"></i>
              </md-button>

              <md-button id="delete-button" style="margin: 0 2px;"
                         v-on:click="deleteSwitchTeaching(item.switchTeachingID, item.assistantFrom, item.assistantTo)">
                <i class="fa fa-trash fa-2x"></i>
              </md-button>
            </div>
          </md-table-cell>

        </md-table-row>

      </md-table>

    </md-card>

  </div>

</template>

<script>
import {
  XlsxDownload,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx";

import {
  createSwitchTeaching,
  deleteSwitchTeaching,
  switchTeaching,
  updateSwitchTeaching,
} from "@/gql/switchTeaching";

import {decryptSession} from "@/utils/sessionHandler";
import {formatDate, getFullFormatDate} from "@/utils/dateHandler";
import {getCourseSubject} from "@/gql/courseSubject";

export default {
  name: "OfficerManageSwitchTeaching",
  data: () => ({
    switchTeaching: null,
    getCourseSubject: null,

    showCreateSwitchDialog: false,
    showUpdateSwitchDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    sheet: [
      {
        name: "Switch Teaching Log",
        data: [{
          courseSubject: "",
          class: "",
          assistantFrom: "",
          assistantTo: "",
          date: "",
          shift: "",
          session: "",
          approved: "",
          status: "",
        }],
      },
    ],

    selectedID: "",
    ast: "",
    ast2: "",
    status: "",
    courseSubject: "",
    class_: "",
    date: new Date(),

    formatDate,
  }),
  components: {
    XlsxSheet,
    XlsxWorkbook,
    XlsxDownload,
  },
  mounted() {
    this.$apollo.query({
      query: switchTeaching,
      fetchPolicy: "no-cache",
      variables: {
        SelectSwitchTeaching: {
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
      this.switchTeaching = data.data.switchTeaching;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
    });

    this.$apollo.query({
      query: getCourseSubject,
      fetchPolicy: "no-cache",
      variables: {
        TransactionInput: {
          semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
        },
      },
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
          messier: decryptSession(localStorage.getItem("messier-token")),
        },
      },
    }).then((data) => {
      this.getCourseSubject = data.data.getCourseSubject;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    openCreateDialog() {
      this.selectedID = "";
      this.courseSubject = "";
      this.ast = "";
      this.class_ = "";
      this.date = new Date();
      this.showCreateSwitchDialog = true;
    },
    openUpdateDialog(id, ast, status) {
      this.selectedID = id;
      this.status = status;
      this.showUpdateSwitchDialog = true;
    },
    formatName() {
      return "Switch Teaching Log.xlsx";
    },
    formatSheet() {
      if (this.switchTeaching !== null) {
        if (this.switchTeaching.length !== 0) {
          return [
            {
              name: "Switch Teaching Log",
              data: this.switchTeaching.map((data) => ({
                courseSubject: data.courseSubject,
                class: data.class,
                assistantFrom: data.assistantFrom,
                assistantTo: data.assistantTo,
                date: this.formatDate(data.date),
                shift: data.shift,
                session: data.session,
                approved: data.approved,
                status: data.status,
              })),
            },
          ];
        }
      }
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
            assistantFrom: this.ast,
            assistantTo: this.ast2,
            class: this.class_,
            date: getFullFormatDate(this.date),
            ignore: true,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        this.switchTeaching.push(data.data.createSwitchTeaching);
        this.snackbarMessage = "Create switch teaching success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    approveSwitchTeaching(id, isApprove) {
      this.$apollo.mutate({
        mutation: updateSwitchTeaching,
        fetchPolicy: "no-cache",
        variables: {
          ID: id,
          UpdateSwitchTeachingInput: {
            approved: isApprove,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then(() => {
        for (let i = 0; i < this.switchTeaching.length; i++) {
          if (this.switchTeaching[i].switchTeachingID === id) {
            this.switchTeaching[i].approved = isApprove;
          }
        }
        this.snackbarMessage = "Update switch teaching success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    updateSwitchTeaching() {
      this.$apollo.mutate({
        mutation: updateSwitchTeaching,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
          UpdateSwitchTeachingInput: {
            status: this.status,
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
            this.switchTeaching[i].assistantTo = this.ast;
            this.switchTeaching[i].status = this.status;
            break;
          }
        }
        this.showUpdateSwitchDialog = false;
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  background-color: white;
}

.form {
  padding: 0 10%;
  width: 40vw;
}

#button-container {
  margin-bottom: 20px;
}

.empty-switch-card {
  padding: 20px;

  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.switch-card {
  padding: 20px;

  width: 92%;

  text-align: left;
}

.title-table {
  margin-bottom: 10px;

  font-size: 20px;
}

.md-button {
  min-width: 1%;
}

</style>
