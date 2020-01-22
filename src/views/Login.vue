<template>
    <v-content>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Login</v-toolbar-title>
                            <v-spacer />
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field label="Login" name="login" type="text" v-model="login" />
                                <v-text-field
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    v-model="password"
                                />
                                <v-alert v-show="showAlert" type="error">Wrong username or password.</v-alert>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="secondary" to="/signup">Signup</v-btn>
                            <v-spacer />
                            <v-btn color="primary" @click="submit">Login</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script lang="ts">
import Vue from 'vue';
import { ipcRenderer } from 'electron';
export default Vue.extend({
    props: {
        source: String,
    },
    data: () => {
        return {
            login: '',
            password: '',
            showAlert: false,
        };
    },

    methods: {
        submit() {
            ipcRenderer.send('login-data', this.login, this.password);
            ipcRenderer.on('login-passed', (event: Electron.Event, hasPassed: boolean) => {
                if (hasPassed) {
                    this.showAlert = false;
                    this.$router.push('/');
                } else {
                    this.showAlert = true;
                }
            });
        },
    },
});
</script>
