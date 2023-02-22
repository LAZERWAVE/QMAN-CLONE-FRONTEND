<template>

  <div id="main-container"
       v-if="petitions !== null">

    <md-snackbar :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarMessage }}</span>
      <md-button class="md-primary" @click="showSnackbar=false">OK</md-button>
    </md-snackbar>

    <md-card class="empty-petition-card md-primary"
             v-if="this.petitions.length === 0">
      NO ONGOING PETITION DATA
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
        <md-button id="join-button" class="md-raised"
                   v-if="!checkParticipation(petition.petitionID)"
                   v-on:click="createPetitionDetail(petition.petitionID)">
          Join
        </md-button>
        <md-chip id="joined-chip"
                 v-if="checkParticipation(petition.petitionID)">
          Joined
        </md-chip>
      </md-card-actions>

    </md-card>

  </div>

</template>

<script>
import {createPetitionDetail, petitions} from "@/gql/petition";

import {decryptSession} from "@/utils/sessionHandler";
import {formatDate} from "@/utils/dateHandler";

export default {
  name: "AssitantPetitionTab",
  data: () => ({
    petitions: null,

    showSnackbar: false,
    snackbarMessage: "",

    formatDate,
  }),
  mounted() {
    this.$apollo.query({
      query: petitions,
      fetchPolicy: "no-cache",
      variables: {
        SelectPetition: {
          semesterID: JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
              "{}" : decryptSession(localStorage.getItem("semester"))).semesterID,
          ongoing: true,
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
    createPetitionDetail(id) {
      this.$apollo.mutate({
        mutation: createPetitionDetail,
        fetchPolicy: "no-cache",
        variables: {
          CreatePetitionDetailInput: {
            petitionID: id,
            shift: 1,
            location: "724",
            kpiPoint: 1,
            bgPoint: 1,
            approved: false,
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
    checkParticipation(id) {
      let check = false;
      this.petitions.forEach((petition) => {
        if (petition.petitionDetails) {
          petition.petitionDetails.forEach((detail) => {
            if (detail.assistant === JSON.parse(decryptSession(localStorage.getItem("session"))).initial &&
                petition.petitionID === id) {
              check = true;
            }
          });
        }
      });
      return check;
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

.empty-petition-card {
  padding: 20px;
  width: 92%;

  font-weight: bolder;
  letter-spacing: 3px;
}

.petition-card {
  margin: 1%;
  width: 45%;
}

#join-button, #joined-chip {
  color: #1976D2;
  font-weight: bold;
}

#joined-chip {
  background-color: white
}
</style>s
