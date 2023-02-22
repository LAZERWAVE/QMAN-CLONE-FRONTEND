<template>

  <div id="main-container"
       v-if="involvement !== null">

    <div class="chart-container">

      <div class="chart-content" v-if="!checkInvolvementData()">
        <pie-chart :data="chartInvolvementData()"></pie-chart>
      </div>

      <div class="card-container">
        <md-card class="detail-card md-primary">
          <md-card-header-text class="card-title">KPI Grade</md-card-header-text>
          <md-card-header-text>{{ this.involvement.kpiGrade }}</md-card-header-text>
        </md-card>
        <md-card class="detail-card md-primary">
          <md-card-header-text class="card-title">Binusian Grade for Competition</md-card-header-text>
          <md-card-header-text>{{ this.involvement.bgCompetitionGrade }}</md-card-header-text>
        </md-card>
      </div>

      <div class="card-container">
        <md-card class="detail-card md-primary">
          <md-card-header-text class="card-title">Binusian Grade for Trainer</md-card-header-text>
          <md-card-header-text>{{ this.involvement.bgTrainerGrade }}</md-card-header-text>
        </md-card>
        <md-card class="detail-card md-primary">
          <md-card-header-text class="card-title">Binusian Grade for Other</md-card-header-text>
          <md-card-header-text>{{ this.involvement.bgOtherGrade }}</md-card-header-text>
        </md-card>
      </div>

    </div>

    <div class="main-container">

      <md-card class="md-primary">
        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <span class="title-table">List of Switch Teaching</span>
            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>
          <md-card-expand-content>
            <div class="empty-table" v-if="this.involvement.switchTeaching.length === 0">
              NO SWITCH TEACHING DATA
            </div>
            <div v-if="this.involvement.switchTeaching.length !== 0">
              <md-table class="tables"
                        v-model="this.involvement.switchTeaching">
                <md-table-row slot="md-table-row" slot-scope="{ item }" class="md-primary">
                  <md-table-cell md-label="Assistant">{{ item.assistantFrom }}</md-table-cell>
                  <md-table-cell md-label="Plus Point (+)">{{ item.totalForMe }}</md-table-cell>
                  <md-table-cell md-label="Minus Point (-)">{{ item.totalForYou }}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
          </md-card-expand-content>
        </md-card-expand>
      </md-card>

      <hr>

      <md-card class="md-primary">
        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <span class="title-table">List of Joined Petition</span>
            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>
          <md-card-expand-content>
            <div class="empty-table" v-if="this.involvement.petition.length === 0">
              NO JOINED PETITION DATA
            </div>
            <div v-if="this.involvement.petition.length !== 0">
              <md-table class="tables"
                        v-model="this.involvement.petition">
                <md-table-row slot="md-table-row" slot-scope="{ item }" :class="'md-primary'" md-auto-select>
                  <md-table-cell md-label="Petition Title">{{ item.petitionTitle }}</md-table-cell>
                  <md-table-cell md-label="Petition Type">{{ item.mode }}</md-table-cell>
                  <md-table-cell md-label="Date">{{ formatDate(item.date) }}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
          </md-card-expand-content>
        </md-card-expand>
      </md-card>

      <hr>

      <md-card class="md-primary">
        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <span class="title-table">List of Additional Class</span>
            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>
          <md-card-expand-content>
            <div class="empty-table" v-if="this.involvement.additionalClass.length === 0">
              NO ADDITIONAL CLASS DATA
            </div>
            <div v-if="this.involvement.additionalClass.length !== 0">
              <md-table class="tables"
                        v-model="this.involvement.additionalClass">
                <md-table-row slot="md-table-row" slot-scope="{ item }" :class="'md-primary'" md-auto-select>
                  <md-table-cell md-label="Course Subject">{{ item.courseSubject }}</md-table-cell>
                  <md-table-cell md-label="Class">{{ item.class }}</md-table-cell>
                  <md-table-cell md-label="Date">{{ formatDate(item.date) }}</md-table-cell>
                  <md-table-cell md-label="Shift">{{ item.shift }}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
          </md-card-expand-content>
        </md-card-expand>
      </md-card>

    </div>

  </div>
</template>

<script>
import VueCharts from "vue-chartjs";

import {involvement} from "../../gql/involvement";

import {decryptSession} from "../../utils/sessionHandler";
import {formatDate} from "../../utils/dateHandler";

export default {
  name: "AssistantInvolvementTab",
  data: () => ({
    involvement: null,

    formatDate,
  }),
  mounted() {
    this.$apollo.query({
      query: involvement,
      fetchPolicy: "no-cache",
      variables: {
        InvolvementInput: {
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
      this.involvement = data.data.involvement;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  extends: VueCharts,
  methods: {
    chartInvolvementData() {
      return [
        ["Petition", this.involvement.petition.length],
        ["Additional Class", this.involvement.additionalClass.length],
        ["Switch Teaching", this.involvement.switchTeaching.length],
      ];
    },
    checkInvolvementData() {
      return this.involvement.petition.length +
          this.involvement.additionalClass.length +
          this.involvement.switchTeaching.length === 0;
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

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-content {
  width: 100%;
}

.card-container {
  margin-top: 30px;

  display: flex;
  flex-direction: row;
}

.detail-card {
  padding: 10px;
  margin: 10px;

  width: 300px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 18px;
}

.main-container {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;

  width: 90%;

  text-align: left;
}

.title-table {
  font-size: 20px;
}

.tables, .empty-table {
  margin: 10px 10px 20px 10px;
}

.empty-table {
  text-align: center;
  font-weight: bolder;
  letter-spacing: 3px;
}

</style>
