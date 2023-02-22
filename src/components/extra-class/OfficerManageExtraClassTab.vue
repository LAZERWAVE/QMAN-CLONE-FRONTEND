<template>

  <div id="main-container"
       v-if="additionalClass !== null && getCourseSubject !== null">

    <md-dialog :md-active.sync="showCreateClassDialog">

      <md-dialog-title>Extra Class Details</md-dialog-title>

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
          <label>Partner Initial 1</label>
          <md-input v-model="ast" required></md-input>
        </md-field>

        <md-field>
          <label>Partner Initial 2</label>
          <md-input v-model="ast2" required></md-input>
        </md-field>

        <md-field>
          <label>Location</label>
          <md-input v-model="location" required></md-input>
        </md-field>

        <md-datepicker v-model="date" md-immediately :md-disabled-dates="disabledDates"/>

        <md-field>
          <label>Shift</label>
          <md-input v-model="shift" required type="number"></md-input>
        </md-field>

      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showCreateClassDialog = false">Close</md-button>
        <md-button class="md-primary" @click="createExtraClass()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-dialog :md-active.sync="showUpdateClassDialog">

      <md-dialog-title>Update Extra Class</md-dialog-title>

      <div class="form">
        <md-field>
          <label>location</label>
          <md-input v-model="location" required/>
        </md-field>
      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showUpdateClassDialog = false">Close</md-button>
        <md-button class="md-primary" @click="updateAdditionalClass()">Save</md-button>
      </md-dialog-actions>

    </md-dialog>

    <div id="export-button">

      <div>
        <md-button class="md-raised md-primary"
                   v-on:click="openCreateDialog()">
          Create Extra Class
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

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-class-card md-primary"
             v-if="this.additionalClass.length === 0">
      NO ADDITIONAL CLASS DATA
    </md-card>

    <md-card class="class-card md-primary"
             v-if="this.additionalClass.length !== 0">

      <md-card-actions md-alignment="space-between">
        <span class="title-table">List of Extra Class</span>
      </md-card-actions>

      <md-table v-model="additionalClass"
                md-sort="courseSubject"
                md-sort-order="asc"
                md-card>

        <md-table-row slot="md-table-row" slot-scope="{ item }">

          <md-table-cell md-label="Course Subject" md-sort-by="courseSubject">
            {{ item.courseSubject }}
          </md-table-cell>

          <md-table-cell md-label="Class" md-sort-by="class">
            {{ item.class }}
          </md-table-cell>

          <md-table-cell md-label="Assistants">
            {{ item.assistantInitial1 }}
            <br>
            {{ item.assistantInitial2 }}
          </md-table-cell>

          <md-table-cell md-label="Date" md-sort-by="date">
            {{ formatDate(item.date) }} <br> Shift {{ item.shift }}
          </md-table-cell>

          <md-table-cell md-label="Location" md-sort-by="location">
            <div v-if="validURL(item.location)">
              <a v-bind:href=item.location target="_blank">Zoom Link</a>
              <md-tooltip md-direction="bottom">{{ item.location }}</md-tooltip>
            </div>
            <div v-if="!validURL(item.location)" class="chips">Room {{ item.location }}</div>
          </md-table-cell>

          <md-table-cell md-label="Total">
            {{ item.additionalClassDetails.length }}
          </md-table-cell>

          <md-table-cell md-label="Status" md-sort-by="done">
            {{ (item.done) ? "Done" : "Not Done" }}
          </md-table-cell>

          <md-table-cell>
            <div style="display: flex; flex-direction: row">
              <md-button id="update-button" style="margin: 0 2px;"
                         v-on:click="openUpdateDialog(item.additionalClassID, item.location)">
                <i class="fa fa-pencil fa-2x"></i>
              </md-button>
              <md-button id="delete-button" style="margin: 0 2px;"
                         v-on:click="deleteAdditionalClass(item.additionalClassID, item.courseSubject, item.class)">
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
  additionalClassWithParticipant, createAdditionalClass,
  deleteAdditionalClass,
  updateAdditionalClass,
} from "@/gql/additionalClass";
import {getCourseSubject} from "@/gql/courseSubject";

import {decryptSession} from "@/utils/sessionHandler";
import {validURL} from "@/utils/urlHandler";
import {disabledDates, formatDate, getFullFormatDate} from "@/utils/dateHandler";

export default {
  name: "OfficerManageExtraClassTab",
  data: () => ({
    additionalClass: null,
    getCourseSubject: null,

    showCreateClassDialog: false,
    showUpdateClassDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    sheet: [
      {
        name: "Extra Class Log",
        data: [{
          courseSubject: "",
          assistantInitial1: "",
          assistantInitial2: "",
          date: "",
          shift: 0,
          location: "",
          done: "",
          participantCount: 0,
          totalStudent: 0,
          ratio: 0 + "%",
          valid: "FALSE",
        }],
      },
    ],

    selectedID: "",
    courseSubject: "",
    class_: "",
    ast: "",
    ast2: "",
    date: new Date(),
    shift: "",
    location: "",

    validURL,
    disabledDates,
    formatDate,
  }),
  components: {
    XlsxSheet,
    XlsxWorkbook,
    XlsxDownload,
  },
  mounted() {
    this.$apollo.query({
      query: additionalClassWithParticipant,
      fetchPolicy: "no-cache",
      variables: {
        SelectAdditionalClass: {
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
      this.class_ = "";
      this.ast = "";
      this.ast2 = "";
      this.date = new Date();
      this.shift = "";
      this.location = "";
      this.showCreateClassDialog = true;
    },
    openUpdateDialog(id, location) {
      this.selectedID = id;
      this.location = location;
      this.showUpdateClassDialog = true;
    },
    formatName() {
      return "Extra Class Log.xlsx";
    },
    formatSheet() {
      if (this.additionalClass !== null) {
        return [
          {
            name: "Extra Class Log",
            data: this.additionalClass.map((data) => ({
              courseSubject: data.courseSubject,
              assistantInitial1: data.assistantInitial1,
              assistantInitial2: data.assistantInitial2,
              date: this.formatDate(data.date),
              shift: data.shift,
              location: data.location,
              done: data.done,
              participantCount: data.additionalClassDetails.length,
              totalStudent: data.totalStudent,
              ratio: (parseInt(data.additionalClassDetails.length) / parseInt(data.totalStudent) * 100) + "%",
              valid: data.valid,
            })),
          },
        ];
      }
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
            assistantInitial1: this.ast,
            assistantInitial2: this.ast2,
            date: getFullFormatDate(this.date),
            shift: parseInt(this.shift),
            location: this.location,
            class: this.class_,
            ignore: true,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        this.additionalClass.push(data.data.createAdditionalClass);
        this.snackbarMessage = "Create extra class success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    updateAdditionalClass() {
      this.$apollo.mutate({
        mutation: updateAdditionalClass,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
          UpdateAdditionalClassInput: {
            location: this.location,
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
        this.showUpdateClassDialog = false;
        this.snackbarMessage = "Update switch teaching success.";
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

#export-button {
  display: flex;
  flex-direction: column;
}

a, .chips {
  color: black !important;
}

#update-button, #delete-button {
  margin-left: -20%;
}

#export-button {
  display: flex;
  justify-content: center;

  margin-bottom: 20px;
}

.empty-class-card {
  padding: 20px;

  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.class-card {
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
