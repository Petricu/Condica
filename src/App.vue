<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center"></div>
        </v-app-bar>

        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'App',

    data: () => ({
        //
    }),
    mounted(): void {
        if (this.$route.path != '/login') this.$router.push('/login');
    },
});
</script>
