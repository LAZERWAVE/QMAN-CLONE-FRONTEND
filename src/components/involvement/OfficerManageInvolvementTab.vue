<template>

  <div v-if="involvementAll.length !== 0">

    <xlsx-workbook>
      <xlsx-sheet
          :collection="sheet.data"
          v-for="sheet in formatSheet()"
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

</template>

<script>
import {XlsxDownload, XlsxSheet, XlsxWorkbook} from "vue-xlsx";

import {involvementAll} from "@/gql/involvement";

import {decryptSession} from "@/utils/sessionHandler";

export default {
  name: "OfficerManageInvolvementTab",
  data: () => ({
    involvementAll: [],
  }),
  components: {
    XlsxSheet,
    XlsxWorkbook,
    XlsxDownload,
  },
  mounted() {
    this.$apollo.query({
      query: involvementAll,
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
      this.involvementAll = data.data.involvementAll;
    }).catch((error) => {
      this.snackbarMessage = error.message.substr(error.message.indexOf(":") + 2, error.message.length - 1);
      this.showSnackbar = true;
    });
  },
  methods: {
    formatName() {
      return JSON.parse(decryptSession(localStorage.getItem("semester")) === "" ?
          "{}" : decryptSession(localStorage.getItem("semester"))).semesterDescription +
          " Involvement Log.xlsx";
    },
    formatSheet() {
      if (this.involvementAll !== null) {
        return [{
          name: "Involvement Log",
          data: this.involvementAll.map((data) => ({
            initial: data.initial,
            kpiGrade: data.kpiGrade,
            kpiTotal: data.kpiTotal,
            kpiDescription: data.kpiDescription,
            bgOtherGrade: data.bgOtherGrade,
            bgOtherTotal: data.bgOtherTotal,
            bgOtherDescription: data.bgOtherDescription,
            bgCompetitionGrade: data.bgCompetitionGrade,
            bgCompetitionDescription: data.bgCompetitionDescription,
            bgTrainerGrade: data.bgTrainerGrade,
            bgTrainerDescription: data.bgTrainerDescription,
          })),
        }];
      }

      return [{
        name: "Involvement Log",
        data: [{
          "initial": "",
          "kpiGrade": "",
          "kpiTotal": "",
          "kpiDescription": "",
          "bgOtherGrade": "",
          "bgOtherTotal": "",
          "bgOtherDescription": "",
          "bgCompetitionGrade": "",
          "bgCompetitionDescription": "",
          "bgTrainerGrade": "",
          "bgTrainerDescription": "",
        }],
      }];
    },
  },
};
</script>

<style scoped>

</style>
