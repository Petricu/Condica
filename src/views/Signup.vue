<template>
    <v-content>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Signup</v-toolbar-title>
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
                                <v-text-field
                                    id="repeatPassword"
                                    label="Password"
                                    name="repeatPassword"
                                    type="password"
                                    v-model="repeatPassword"
                                    :error-messages="repeatPasswordError"
                                />
                                <v-text-field label="nrOfHours" name="nrOfHours" type="number" v-model="nrOfHours" />
                                <v-alert v-show="showAlert" type="error">{{ alertText }}</v-alert>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="secondary" to="/login">Login</v-btn>
                            <v-spacer />
                            <v-btn color="primary" @click="submit">Signup</v-btn>
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
    name: 'Signup',
    data() {
        return {
            login: '',
            password: '',
            repeatPassword: '',
            repeatPasswordError: '',
            showAlert: false,
            alertText: '',
            nrOfHours: 8,
        };
    },
    methods: {
        submit() {
            let signupData: Object = {
                login: this.login,
                password: this.password,
                nrOfHours: this.nrOfHours,
            };
            if (this.checkEmptyFields() && this.checkPassword()) {
                ipcRenderer.send('signup', signupData);
                ipcRenderer.on('signup-passed', (event: Electron.Event, hasPassed: boolean) => {
                    if (!hasPassed) {
                        this.showAlert = true;
                        this.alertText = 'Signup unsuccessful.';
                    } else {
                        this.showAlert = false;
                        this.alertText = '';
                        this.$router.push('/login');
                    }
                });
            }
        },
        checkPassword(): boolean {
            if (this.password != this.repeatPassword) {
                this.repeatPasswordError = "Password doesn't match";
                return false;
            }
            this.repeatPasswordError = '';
            return true;
        },
        checkEmptyFields(): boolean {
            if (this.password.length == 0 || this.login.length == 0 || this.repeatPassword.length == 0) {
                this.alertText = 'Some Fields are Empty';
                this.showAlert = true;
                return false;
            }
            this.showAlert = false;
            return true;
        },
    },
});
</script>

<style scoped />
