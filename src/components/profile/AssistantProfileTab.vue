<template>

  <div id="assistant-navbar"
       v-if="profileAssistant !== null && getSemester.length !== 0">

    <div id="assistant-navbar-layout">

      <div id="nav-left">

        <div id="nav-picture">
          <md-avatar class="md-large">
            <img v-if="successImage"
                 :src="'https://laboratory.binus.ac.id/lapi/api/Account/GetThumbnail?id=' +
                        profileAssistant.pictureID" @error="onImgLoad" alt="">
            <img v-if="errorImage"
                 src="../../assets/empty_avatar.png" alt="">
          </md-avatar>
        </div>

        <div id="nav-profile">
          <div id="nav-profile-name">
            {{ profileAssistant.name }}
          </div>
          <div id="nav-profile-initial">
            {{ profileAssistant.username }}
          </div>
          <div id="nav-profile-semester">
            {{ this.selectedSemesterDescription }}
          </div>
        </div>
      </div>

      <div id="nav-right">

        <div id="nav-semester">
          <md-menu md-direction="bottom-end" :mdCloseOnSelect="true">
            <md-button id="semester-button" class="md-raised" md-menu-trigger>
              Change Semester
            </md-button>
            <md-menu-content>
              <md-menu-item v-for="semester in this.getSemester"
                            v-bind:key="semester.semesterID"
                            v-on:click="chooseSemester(semester.semesterID, semester.description)">
                {{ semester.description }}
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <div>
          <md-button id="logout-button" class="md-raised"
                     v-on:click="logout()">
            Log Out
            <v-icon id="logout-icon" name="sign-out-alt" scale="2"/>
          </md-button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import router from "@/router";

import {profileAssistant} from "@/gql/profile";
import {getSemester} from "@/gql/semester";

import {encryptSession, decryptSession, resetLocalStorage} from "@/utils/sessionHandler";

export default {
  name: "AssistantProfileTab",
  data: () => ({
    getSemester: [],
    profileAssistant: null,

    selectedSemester: JSON.parse(decryptSession(localStorage.getItem("semester"))).semesterID,
    selectedSemesterDescription: JSON.parse(decryptSession(localStorage.getItem("semester"))).semesterDescription,

    successImage: true,
    errorImage: false,
  }),
  mounted: function() {
    this.$apollo.query({
      query: profileAssistant,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.profileAssistant = data.data.profileAssistant;
    });

    this.$apollo.query({
      query: getSemester,
      fetchPolicy: "no-cache",
    }).then((data) => {
      this.getSemester = data.data.getSemester;
    });
  },
  methods: {
    onImgLoad() {
      this.successImage = false;
      this.errorImage = true;
    },
    logout() {
      resetLocalStorage();
      router.push("/login/Assistant");
    },
    chooseSemester(id, description) {
      const semester = {};
      semester.semesterID = id;
      semester.semesterDescription = description;
      const semesterJSON = JSON.stringify(semester);

      localStorage.setItem("semester", encryptSession(semesterJSON));

      this.$router.go(0);
    },
  },
};
</script>

<style scoped>
*:not(h1) {
  font-size: larger;
}

#assistant-navbar {
  display: flex;
  justify-content: space-between;

  background-color: #448aff;

  border-bottom: white solid 1px;
}

#assistant-navbar-layout {
  padding: 0.25% 4%;

  width: 100%;

  display: flex;
  justify-content: space-between;
}

#nav-left, #nav-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-size: 13px;
}

#nav-picture {
  margin: 1% 5% 1% 5%;
}

#nav-profile {
  margin-left: 5%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  text-align: left;
  color: white;
  white-space: nowrap;
}

#nav-profile-name, #nav-profile-initial {
  font-size: 95%;
}

#nav-profile-name {
  font-weight: bold;
}

#nav-profile-semester {
  font-size: 90%;
}

#nav-semester {
  display: flex;
  justify-content: center;
  align-items: center;
}

#semester-button {
  font-size: 80%;
  color: #448aff;
}

#logout-button {
  font-size: 97.5%;
  color: #ff5252;
}

#logout-icon {
  height: 20px;
}
</style>
