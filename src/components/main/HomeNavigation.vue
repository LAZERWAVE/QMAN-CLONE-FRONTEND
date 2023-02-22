<template>

  <div>

    <!-- Assistant Navigation Bar -->
    <div id="assistant-navbar" v-if="role === 'ASSISTANT' || role === 'OFFICER'">
      <app-assistant-profile-tab></app-assistant-profile-tab>
    </div>

    <md-tabs class="md-primary" md-alignment="centered" id="assistant" v-if="role === 'ASSISTANT'"
             style="border: none">

      <md-tab id="tab-assistant-home" md-label="My Transaction" style="border: none; outline: none">
        <app-assistant-home-tab></app-assistant-home-tab>
      </md-tab>

      <md-tab id="tab-assistant-extra-class" md-label="My Extra Class">
        <app-assistant-extra-class-tab></app-assistant-extra-class-tab>
      </md-tab>

      <md-tab id="tab-assistant-switch-teaching" md-label="My Switch Teaching">
        <app-switch-teaching-tab></app-switch-teaching-tab>
      </md-tab>

      <md-tab id="tab-assistant-petition" md-label="Ongoing Petition">
        <app-assistant-petition-tab></app-assistant-petition-tab>
      </md-tab>

      <md-tab id="tab-assistant-involvement" md-label="My Involvement">
        <app-assistant-involvement-tab></app-assistant-involvement-tab>
      </md-tab>

    </md-tabs>


    <!-- Officer Navigation Bar -->
    <md-tabs class="md-primary" md-alignment="centered" id="operation-officer" v-if="role === 'OFFICER'">

      <md-tab id="tab-officer-home" md-label="My Transaction">
        <app-assistant-home-tab></app-assistant-home-tab>
      </md-tab>

      <md-tab id="tab-assistant-extra-class" md-label="Extra Class"
              style="padding: 0;">

        <md-tabs class="md-primary" md-alignment="centered" id="operation-officer-extra-class"
                 style="border-top: 1px solid white;">

          <md-tab id="tab-officer-my-extra-class" md-label="My Extra Class">
            <app-assistant-extra-class-tab></app-assistant-extra-class-tab>
          </md-tab>

          <md-tab id="tab-officer-manage-extra-class" md-label="Manage Extra Class">
            <app-officer-manage-extra-class-tab></app-officer-manage-extra-class-tab>
          </md-tab>

        </md-tabs>

      </md-tab>

      <md-tab id="tab-officer-switch-teaching" md-label="Switch Teaching"
              style="padding: 0;">

        <md-tabs class="md-primary" md-alignment="centered" id="operation-officer-switch-teaching"
                 style="border-top: 1px solid white;">

          <md-tab id="tab-officer-my-switch-teaching" md-label="My Switch Teaching">
            <app-switch-teaching-tab></app-switch-teaching-tab>
          </md-tab>

          <md-tab id="tab-officer-manage-switch-teaching" md-label="Manage Switch Teaching">
            <app-officer-manage-switch-teaching-tab></app-officer-manage-switch-teaching-tab>
          </md-tab>

        </md-tabs>

      </md-tab>

      <md-tab id="tab-officer-petition" md-label="Petition"
              style="padding: 0;">

        <md-tabs class="md-primary" md-alignment="centered" id="operation-officer-petition"
                 style="border-top: 1px solid white;">

          <md-tab id="tab-officer-ongoing-petition" md-label="Ongoing Petition">
            <app-assistant-petition-tab></app-assistant-petition-tab>
          </md-tab>

          <md-tab id="tab-officer-manage-petition" md-label="Manage Petition">
            <app-officer-petition-tab></app-officer-petition-tab>
          </md-tab>

        </md-tabs>

      </md-tab>

      <md-tab id="tab-officer-involvement" md-label="Involvement"
              style="padding: 0;">

        <md-tabs class="md-primary" md-alignment="centered" id="tab-officer-petition"
                 style="padding: 0;">

          <md-tab id="tab-officer-my-involvement" md-label="My Involvement">
            <app-assistant-involvement-tab></app-assistant-involvement-tab>
          </md-tab>

          <md-tab id="tab-officer-manage-involvement" md-label="Manage Involvement">
            <app-officer-manage-involvement-tab></app-officer-manage-involvement-tab>
          </md-tab>

        </md-tabs>

      </md-tab>

    </md-tabs>


    <!-- Student Navigation Bar -->
    <div id="student-navbar" v-if="role === 'STUDENT'">
      <app-student-profile-tab></app-student-profile-tab>
    </div>

    <md-tabs class="md-primary" md-alignment="centered" id="student" v-if="role === 'STUDENT'">

      <md-tab id="tab-student-home" md-label="My Transaction">
        <app-student-home-tab></app-student-home-tab>
      </md-tab>

      <md-tab id="tab-student-extra-class" md-label="Ongoing Extra Class">
        <app-student-participate-extra-class-tab></app-student-participate-extra-class-tab>
      </md-tab>

      <md-tab id="tab-student-joined-extra-class" md-label="Joined Extra Class">
        <app-student-participated-extra-class-tab></app-student-participated-extra-class-tab>
      </md-tab>

    </md-tabs>

  </div>
</template>

<script>
import router from "@/router";

import {disabledDates} from "@/utils/dateHandler";
import {decryptSession, resetLocalStorage} from "@/utils/sessionHandler";

export default {
  name: "HomeNavigation",
  data: () => ({
    role: "",
  }),
  mounted: function() {
    try {
      const session = decryptSession(localStorage.getItem("session"));
      this.role = JSON.parse(session).role;

      if (disabledDates(decryptSession(localStorage.getItem("expires-token")))) {
        resetLocalStorage();
        router.push("/");
      }
    } catch (error) {
      resetLocalStorage();
      router.push("/");
    }
  },
};
</script>
