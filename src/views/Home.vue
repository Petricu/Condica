<template>
  <div id="app">
    <v-app id="inspire">
      <v-sheet color="grey lighten-4" class="px-3 pt-3 pb-3">
        <v-skeleton-loader
          class="mx-auto"
          max-width="500"
          type="card-heading, actions"
          :loading="contorLoading"
        >
          <v-card class="mx-auto" max-width="500">
            <v-card-title class="display-4 justify-center">{{
              contorDisplay
            }}</v-card-title>
            <v-card-actions class="py-5 mx-4">
              <v-spacer />
              <v-btn dark large color="red lighten-1" class="px-5" to="/login"
                >Logout</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-skeleton-loader>
      </v-sheet>
    </v-app>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import Vue from 'vue';
import Timeout = NodeJS.Timeout;
export default Vue.extend({
  props: {
    source: String,
  },
  data: (): {
    data: Object;
    contorLoading: boolean;
    nrOfSeconds: number;
    intervalReference: Timeout | null;
  } => {
    return {
      data: {},
      contorLoading: true,
      nrOfSeconds: 0,
      intervalReference: null,
    };
  },
  methods: {},
  computed: {
    contorDisplay(): string {
      let hours = Math.floor(this.nrOfSeconds / 3600);
      let minutes = Math.floor((this.nrOfSeconds - hours * 3600) / 60);
      let seconds = this.nrOfSeconds - hours * 3600 - minutes * 60;
      return hours + ':' + minutes + ':' + seconds;
    },
  },
  mounted() {
    ipcRenderer.on('data', (event: Electron.Event, data: { hours: number }) => {
      this.data = data;
      this.contorLoading = false;
      this.nrOfSeconds = data.hours * 3600;
      let that = this;
      this.intervalReference = setInterval(function() {
        that.nrOfSeconds--;
      }, 1000);
    });
  },
});
</script>
