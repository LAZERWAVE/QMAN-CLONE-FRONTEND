<template>

  <div id="student-navbar"
       v-if="profileStudent !== null">

    <div id="student-navbar-layout">

      <div id="nav-left">

        <div id="nav-picture">
          <md-avatar class="md-large">
            <img v-if="successImage"
                 :src="'https://laboratory.binus.ac.id/lapi/api/Account/GetThumbnail?id=' +
                        profileStudent.pictureID" @error="onImgLoad" alt="">
            <img v-if="errorImage"
                 src="../../assets/empty_avatar.png" alt="">
          </md-avatar>
        </div>

        <div id="nav-profile">
          <div id="nav-profile-name">
            {{ profileStudent.name }}
          </div>
          <div id="nav-profile-nim">
            {{ profileStudent.username }}
          </div>
        </div>

      </div>

      <div id="nav-right">

        <div>
          <md-button id="logout-button" class="md-raised"
                     v-on:click="logout()">
            Log Out
            <v-icon id="logout-icon" name="sign-out-alt"   scale="2"/>
          </md-button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import router from "@/router";

import {profileStudent} from "@/gql/profile";

import {decryptSession, resetLocalStorage} from "@/utils/sessionHandler";

export default {
  name: "StudentProfileTab",
  data: () => ({
    profileStudent: null,

    successImage: true,
    errorImage: false,
  }),
  mounted() {
    this.$apollo.query({
      query: profileStudent,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          authorization: decryptSession(localStorage.getItem("authorization-token")),
        },
      },
    }).then((data) => {
      this.profileStudent = data.data.profileStudent;
    });
  },
  methods: {
    onImgLoad() {
      this.successImage = false;
      this.errorImage = true;
    },
    logout() {
      resetLocalStorage();
      router.push("/login/Student");
    },
  },
};
</script>

<style scoped>
*:not(h1) {
  font-size: larger;
}

#student-navbar {
  display: flex;
  justify-content: center;

  background-color: #448Aff;

  border-bottom: white 1px solid;
}

#student-navbar-layout {
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

  white-space: nowrap;
  text-align: left;
  color: white;
}

#nav-profile-name, #nav-profile-nim {
  font-size: 95%;
}

#nav-profile-name {
  font-weight: bold;
}

#logout-button {
  font-size: 97.5%;
  color: #ff5252;
}

#logout-icon {
  height: 20px;
}
</style>
