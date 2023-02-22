<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>

    <router-view></router-view>
  </div>
</template>


<script>
import {resetLocalStorageIfEmpty} from "./utils/sessionHandler.js";

resetLocalStorageIfEmpty();

export default {
  watch: {
    "$route": {
      handler: function(to) {
        document.title = to.meta.title || "Involvement Web App";
      },
      immediate: true,
    },
  },
};
</script>


<style lang="scss">
@import '~bootstrap';
@import '~bootstrap-vue';
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';
@import "~vue-material/dist/theme/engine";
@import "~vue-material/dist/theme/all";
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

::-webkit-scrollbar {
  display: none;
}
</style>
