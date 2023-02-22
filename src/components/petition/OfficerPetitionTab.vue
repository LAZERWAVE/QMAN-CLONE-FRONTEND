<template>

  <div id="main-container"
       v-if="petitions !== null">

    <md-dialog :md-active.sync="showCreatePetitionDialog">

      <md-dialog-title>Create Petition</md-dialog-title>

      <div class="form">

        <md-field>
          <label>Petition Title</label>
          <md-input v-model="title" required></md-input>
        </md-field>

        <md-field>
          <label>Petition Description</label>
          <md-textarea v-model="description" md-autogrow required></md-textarea>
        </md-field>

        <md-datepicker v-model="selectedDate" md-immediately :md-disabled-dates="disabledDates"/>

        <md-field>
          <label>Petition Max Slot</label>
          <md-input v-model="slot" type="number" required></md-input>
        </md-field>

        <md-field>
          <label>Petition Type</label>
          <md-select v-model="mode" required>
            <md-option value="COMPETITION">COMPETITION</md-option>
            <md-option value="TRAINER">TRAINER</md-option>
            <md-option value="OTHER">OTHER</md-option>
          </md-select>
        </md-field>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showCreatePetitionDialog=false">Close</md-button>
        <md-button class="md-primary" @click="createPetition()">Create Petition</md-button>
      </md-dialog-actions>

    </md-dialog>

    <md-dialog id="excel-dialog" :md-active.sync="showManageParticipantDialog">

      <md-dialog-title>Manage Participant</md-dialog-title>

      <div class="form">

        <md-field>
          <label>Excel File</label>
          <md-file @change="onChange"/>
        </md-field>

        <div id="excel-button">
          <div>
            <xlsx-read :file="file">
              <xlsx-json>
                <template #default="{collection}">
                  <md-button class="md-raised md-primary" v-on:click="loadSheet(collection)">Import Excel</md-button>
                </template>
              </xlsx-json>
            </xlsx-read>
          </div>

          <div>
            <xlsx-workbook>
              <xlsx-sheet
                  :collection="sheet.data"
                  v-for="sheet in formatSheet()"
                  :key="sheet.name"
                  :sheet-name="sheet.name"/>
              <xlsx-download :filename="formatName()">
                <md-button class="md-raised md-primary">Export Excel</md-button>
              </xlsx-download>
            </xlsx-workbook>
          </div>
        </div>

      </div>

    </md-dialog>

    <md-dialog :md-active.sync="showUpdatePetitionDialog">

      <md-dialog-title>Update Petition</md-dialog-title>

      <div class="form">
        <md-field>
          <label>Petition Title</label>
          <md-input v-model="title" required></md-input>
        </md-field>

        <md-field>
          <label>Petition Description</label>
          <md-textarea v-model="description" md-autogrow required></md-textarea>
        </md-field>

        <md-datepicker v-model="selectedDate" md-immediately/>

        <md-field>
          <label>Petition Max Slot</label>
          <md-input v-model="slot" type="number" required></md-input>
        </md-field>

        <md-field>
          <label>Petition Type</label>
          <md-select v-model="mode" required>
            <md-option value="COMPETITION">COMPETITION</md-option>
            <md-option value="TRAINER">TRAINER</md-option>
            <md-option value="OTHER">OTHER</md-option>
          </md-select>
        </md-field>
      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showUpdatePetitionDialog = false">Close</md-button>
        <md-button class="md-primary" @click="updatePetition()">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <div class="create-button">
      <md-button class="md-raised md-primary"
                 v-on:click="openCreateDialog()">
        Create Petition
        <md-icon>add</md-icon>
      </md-button>
    </div>

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-petition-card md-primary"
             v-if="this.petitions.length === 0">
      NO PETITION DATA
    </md-card>

    <md-card class="petition-card md-primary"
             v-for="petition in petitions"
             :key="petition.petitionID">

      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ petition.petitionTitle }}</div>
          <div>{{ formatDate(petition.date) }}</div>
          <div>Created by {{ petition.petitionCreator }}</div>
        </md-card-header-text>
      </md-card-header>

      <md-card-content class="md-subhead">
        <div>Description: {{ petition.petitionDescription }}</div>
      </md-card-content>

      <md-card-actions>

        <md-button v-if="petition.ongoing" class="md-raised" id="ungoing-petition"
                   v-on:click="publishPetition(petition.petitionID, true)">
          Un-Publish
        </md-button>

        <md-button v-if="!petition.ongoing" class="md-raised" id="going-petition"
                   v-on:click="publishPetition(petition.petitionID, false)">
          Publish
        </md-button>

        <md-button class="md-raised" id="manage-petition"
                   v-on:click="openManageParticipantDialog(petition.petitionID ,petition.petitionDetails,
                   petition.petitionTitle, petition.petitionCreator, petition.date)">
          Manage Participant
        </md-button>

        <md-button class="md-raised" id="update-petition"
                   v-on:click="openUpdateDialog(petition.petitionID ,petition.petitionTitle,
                   petition.petitionDescription, petition.petitionMaxSlot, petition.date, petition.mode)">
          Update Petition
        </md-button>

        <md-button class="md-raised" id="delete-petition"
                   v-on:click="deletePetition(petition.petitionID, petition.petitionTitle)">
          Delete
        </md-button>

      </md-card-actions>

    </md-card>

  </div>

</template>

<script>

import {
  XlsxDownload,
  XlsxJson,
  XlsxRead,
  XlsxSheet,
  XlsxWorkbook,
} from "vue-xlsx";

import {
  createAllPetitionDetail,
  createPetition,
  deleteAllPetitionDetail,
  deletePetition,
  petitions,
  updatePetition,
  updatePetitionOngoing,
} from "@/gql/petition";

import {decryptSession} from "@/utils/sessionHandler";
import {disabledDates, formatDate, formatDateReturn} from "@/utils/dateHandler";

export default {
  name: "OfficerPetitionTab",
  data: () => ({
    petitions: [],

    showCreatePetitionDialog: false,
    showUpdatePetitionDialog: false,
    showManageParticipantDialog: false,

    showSnackbar: false,
    snackbarMessage: "",

    selectedID: "",
    title: "",
    description: "",
    selectedDate: new Date(),
    slot: 0,
    creator: "",
    mode: "",

    file: null,
    selectedDetail: null,
    sheet: [
      {
        "assistant": "",
        "location": "",
        "shift": 0,
        "kpiPoint": 0,
        "bgPoint": 0,
        "approved": false,
      },
    ],

    disabledDates,
    formatDate,
    formatDateReturn,
  }),
  components: {
    XlsxRead,
    XlsxJson,
    XlsxSheet,
    XlsxWorkbook,
    XlsxDownload,
  },
  mounted() {
    this.$apollo.query({
      query: petitions,
      fetchPolicy: "no-cache",
      variables: {
        SelectPetition: {
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
      this.petitions = data.data.petitions;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    openCreateDialog() {
      this.selectedID = "";
      this.title = "";
      this.description = "";
      this.slot = 0;
      this.selectedDate = new Date();
      this.mode = "";
      this.showCreatePetitionDialog = true;
    },
    openUpdateDialog(id, title, description, slot, date, mode) {
      this.selectedID = id;
      this.title = title;
      this.description = description;
      this.slot = slot;
      this.selectedDate = this.formatDateReturn(date);
      this.mode = mode;
      this.showUpdatePetitionDialog = true;
    },
    openManageParticipantDialog(id, detail, title, creator, date) {
      this.selectedID = id;
      this.selectedDetail = detail;
      this.title = title;
      this.creator = creator;
      this.selectedDate = date;
      this.showManageParticipantDialog = true;
    },
    formatName() {
      return (this.selectedDetail !== null && this.selectedDetail.length !== 0) ?
          this.title + " Created By " + this.creator + " - " + this.formatDate(this.selectedDate) + ".xlsx" :
          "Template.xlsx";
    },
    formatSheet() {
      if (this.selectedDetail !== null && this.selectedDetail.length !== 0) {
        return [{
          name: "Petition Log",
          data: this.selectedDetail.map((data) => ({
            assistant: data.assistant,
            location: data.location,
            shift: data.shift,
            kpiPoint: data.kpiPoint,
            bgPoint: data.bgPoint,
            approved: data.approved,
          })),
        }];
      }
      return [{
        name: "Petition Log",
        data: this.sheet,
      }];
    },
    loadSheet(json) {
      for (let i = 0; i < json.length; i++) {
        if (Number.isInteger(json[i].location)) {
          json[i].location = json[i].location + "";
        }

        if (json[i].approved === "TRUE") {
          json[i].approved = true;
        } else if (json[i].approved === "FALSE") {
          json[i].approved = false;
        }
      }
      this.sheet = json;
      this.importDetail();
    },
    createPetition() {
      this.$apollo.mutate({
        mutation: createPetition,
        fetchPolicy: "no-cache",
        variables: {
          CreatePetitionInput: {
            petitionTitle: this.title,
            petitionDescription: this.description,
            petitionMaxSlot: parseInt(this.slot),
            date: this.selectedDate,
            semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
                "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
            mode: this.mode,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        this.petitions.push(data.data.createPetition);
        this.showCreatePetitionDialog = false;
        this.snackbarMessage = "Create petition success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    updatePetition() {
      this.$apollo.mutate({
        mutation: updatePetition,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
          UpdatePetitionInput: {
            petitionTitle: this.title,
            petitionDescription: this.description,
            petitionMaxSlot: parseInt(this.slot),
            date: this.selectedDate,
            mode: this.mode,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then((data) => {
        for (let i = 0; i < this.petitions.length; i++) {
          if (this.petitions[i].petitionID === data.data.updatePetition.petitionID) {
            this.petitions[i] = data.data.updatePetition;
            break;
          }
        }
        this.showUpdatePetitionDialog = false;
        this.snackbarMessage = "Update petition success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    publishPetition(id, isGoing) {
      this.$apollo.mutate({
        mutation: updatePetitionOngoing,
        fetchPolicy: "no-cache",
        variables: {
          ID: id,
          UpdatePetitionInput: {
            ongoing: !isGoing,
          },
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then(() => {
        for (let i = 0; i < this.petitions.length; i++) {
          if (this.petitions[i].petitionID === id) {
            this.petitions[i].ongoing = !isGoing;
            break;
          }
        }
        this.snackbarMessage = "Update petition success.";
      }).catch((error) => {
        this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      }).finally(() => {
        this.showSnackbar = true;
      });
    },
    deletePetition(id, title) {
      this.$confirm({
        title: "Delete Petition",
        message: `Are you sure want to delete ${title} petition ?`,
        button: {
          yes: "Yes",
          no: "Cancel",
        },
        callback: (confirm) => {
          if (confirm) {
            this.$apollo.mutate({
              mutation: deletePetition,
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
              for (let i = 0; i < this.petitions.length; i++) {
                if (this.petitions[i].petitionID === data.data.deletePetition.petitionID) {
                  this.petitions.splice(i, 1);
                  break;
                }
              }
              this.snackbarMessage = "Delete petition success.";
            }).catch((error) => {
              this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
            }).finally(() => {
              this.showSnackbar = true;
            });
          }
        },
      });
    },
    importDetail() {
      this.$apollo.mutate({
        mutation: deleteAllPetitionDetail,
        fetchPolicy: "no-cache",
        variables: {
          ID: this.selectedID,
        },
        context: {
          headers: {
            authorization: decryptSession(localStorage.getItem("authorization-token")),
          },
        },
      }).then(() => {
        this.$apollo.mutate({
          mutation: createAllPetitionDetail,
          fetchPolicy: "no-cache",
          variables: {
            CreateAllPetitionDetailInput: {
              id: this.selectedID,
              json: JSON.stringify(this.sheet),
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

.empty-petition-card {
  margin-top: 20px;
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.petition-card {
  margin: 1%;
  width: 92%;
}

.md-subhead {
  text-align: center !important;
}

#manage-petition, #delete-petition, #update-petition, #ungoing-petition, #going-petition {
  color: #1976D2;
  font-weight: bold;
}

#excel-button {
  margin-bottom: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

</style>
