<style>
    .LoginCard {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    .LoginCard .CardTitle {
        margin-top: 150px;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        width: 100%;
        padding: 15px 10px 10px 10px;
    }
</style>
<template>
    <v-container fluid>
        <v-layout row>
            <v-flex xs12 sm6 md4 lg3 offset-sm5 offset-md7 offset-lg8>
                <v-card v-if="isStatusLoggedIn" class="LoginCard">
                    <v-card-media class="white--text" height="200px" src="/images/card-login.jpg">
                        <div class="CardTitle">
                            <h3 class="headline mb-0">Hello {{getFbAccountLastName()}}!</h3>
                        </div>
                    </v-card-media>
                    <v-card-text>
                        You are logged into Facebook. You will be redirected
                        <br/> to select your albums in {{TimerCountdown}}secs.
                        <br/>
                        <br/>If this is not your account, select the Log off button below now.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.stop="onFbLogout" flat color="orange">
                            <v-icon>exit_to_app</v-icon> Log off Facebook</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-if="isStatusLoginReady" class="LoginCard">
                    <v-card-media class="white--text" height="200px" src="/images/card-login.jpg">
                        <div class="CardTitle">
                            <h3 class="headline mb-0">Welcome!</h3>
                        </div>
                    </v-card-media>
                    <v-card-text>
                        <div>
                            To proceed, please log into your Facebook account by selecting the Log In button below.
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.stop="onFbLogin" flat color="orange">
                            <v-icon>account_box</v-icon> Log in to Facebook</v-btn>
                        <v-btn @click="$router.push('about')" flat color="orange">About</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-if="isStatusLoggingIn" class="LoginCard demo-card-event mdl-card mdl-shadow--2dp">
                    <v-card-media class="white--text" height="200px" src="/images/card-logout.jpg">
                        <div class="CardTitle">
                            <h3 class="headline mb-0">See You Soon</h3>
                        </div>
                    </v-card-media>
                    <v-card-text>
                        <div>To proceed, please log into your Facebook account by
                            <br/> selecting the Log In button below.</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.stop="onFbLogin" flat color="orange">
                            <v-icon>account_box</v-icon> Log in to Facebook</v-btn>
                        <v-btn @click="$router.push('about')" flat color="orange">About</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-if="isStatusLoggedOut" class="LoginCard demo-card-event mdl-card mdl-shadow--2dp">
                    <v-card-media class="white--text" height="200px" src="/images/card-logout.jpg">
                        <div class="CardTitle">
                            <h3 class="headline mb-0">See You Soon</h3>
                        </div>
                    </v-card-media>
                    <v-card-text>
                        <div>To proceed, please log into your Facebook account by
                            <br/> selecting the Log In button below.</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.stop="onFbLogin" flat color="orange">
                            <v-icon>account_box</v-icon> Log in to Facebook</v-btn>
                        <v-btn @click="$router.push('about')" flat color="orange">About</v-btn>
                    </v-card-actions>
                </v-card>
                <v-snackbar :timeout="SnackbarTimeout" :bottom="true" :multi-line="false"
                    v-model="isShowSnackbar">
                    {{ SnackbarText }}
                    <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
                </v-snackbar>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';

    const STATUS_LOGIN_READY = 'LOGIN_READY',
        STATUS_LOGGED_OUT = 'LOGGED_OUT',
        STATUS_LOGGING_OUT = 'LOGGING_OUT',
        STATUS_LOGGING_IN = 'LOGGING_IN',
        STATUS_LOGGED_IN = 'LOGGED_IN';

    export default {
        name: 'Login',
        components: {},
        props: ['isLogout'],
        data() {
            return {
                message: '',
                items: [],
                status: STATUS_LOGIN_READY,
                RedirectTimer: null,
                TimerCountdown: 5,
                SnackbarTimeout: 2 * 1000,
                isShowSnackbar: false,
                SnackbarText: 'Logging in...'
            }
        },
        beforeRouteLeave(to, from, next) {
            console.log('login.beforeRouteLeave');
            next();
        },
        computed: {
            isStatusLoggedIn() {
                return this.status === STATUS_LOGGED_IN;
            },
            isStatusLoggedOut() {
                return this.status === STATUS_LOGGED_OUT;
            },
            isStatusLoginReady() {
                return this.status === STATUS_LOGIN_READY;
            },
            isStatusLoggingIn() {
                return this.status === STATUS_LOGGING_IN;
            }
        },
        mounted: function () {
            this.addDebugMessage('event: login.mounted');

            // set background
            var AppEl = document.getElementById('app');
            AppEl.style.backgroundImage = "url('/images/bg/zhang-xupeng-545066.jpg')";
            AppEl.style.backgroundSize = 'cover';

            this.$store.commit('setAppbar', true);
            if (this.isLogout) {
                // note: auto login will not kick in
                this.addDebugMessage('Logging out...');
                this.status = STATUS_LOGGING_OUT;
                this.onFbLogout();
            } else
            if (!window.FbAccount) {
                // get Fb login status if not registered in window
                FB.getLoginStatus(this.handleFbLoginResponse);
            }
        },
        methods: {
            ...mapMutations(['addDebugMessage', 'addErrorMessage',
                'setDebugMessage', 'toggleDebugWindow'
            ]),
            getFbAccountLastName: function () {
                return window.FbAccount.LastName;
            },
            isLoggedIn: function () {
                //  this.$router.push('home');
                console.log('method: login.isLoggedIn');
                return window.FbAccount;
            },
            handleFbLoginResponse: function (resp) {
                this.addDebugMessage(resp);
                var self = this;
                // sanity check on data format
                if ('authResponse' in resp) {
                    if (resp.status === 'connected') {
                        console.log('Logged in');
                        // call FB api to retreive account name
                        FB.api('/me', 'get', {
                            fields: 'last_name, first_name'
                        }, function (resp) {
                            if (!resp && resp.error) {
                                console.error('error in response: ', resp.error);
                                windows.FbAccount = null;
                            } else {
                                console.log('response: ', resp);
                                window.FbAccount = {
                                    LastName: resp.last_name,
                                    FirstName: resp.first_name,
                                    id: resp.id
                                };
                                // set countdown to 5sec
                                self.TimerCountdown = 2;
                                // self.TimerCountdown = 5;
                                self.RedirectTimer = setInterval(() => {
                                    self.TimerCountdown--;
                                    if (self.TimerCountdown === 0) {
                                        clearInterval(self.RedirectTimer);
                                        self.RedirectTimer = null;
                                        self.$router.push('albums');
                                    }
                                }, 1000);
                                self.$forceUpdate();
                            }
                        });
                    } else {
                        if (this.$store.getters.isAutoLogin) {
                            this.addDebugMessage('do auto-login...');
                            // only auto login once per page load
                            this.isAutoLogin = false;
                            this.onFbLogin();
                        }
                    }
                } else {
                    this.addErrorMessage('Invalid response object received in login.handleFbLoginResponse: ', resp);
                }
            },
            onFbLogin: function () {
                this.setDebugMessage('Connecting to Facebook...');
                this.isShowSnackbar = true;
                FB.login(this.handleFbLoginResponse, {
                    scope: 'user_photos, public_profile'
                });
            },
            onFbLogout: function () {
                var self = this;
                FB.logout(function (response) {
                    // Person is now logged out
                    delete window.FbAccount;
                    self.addDebugMessage('Logged out');
                    self.status = STATUS_LOGGED_OUT;
                    setTimeout(() => {
                        self.status = STATUS_LOGIN_READY;
                    }, 5 * 1000);
                    //self.$forceUpdate();
                });
            }
        }
    }
</script>