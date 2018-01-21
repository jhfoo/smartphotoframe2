<style>
    .LoginCard {
        width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
<template>
    <v-content>
        <v-container fluid>
            <v-slide-y-transition mode="out-in">
                <v-layout column align-center>
                    <v-card v-if="isLoggedIn()" class="LoginCard">
                        <v-card-title primary-title>
                            <h3 class="headline mb-0">Hello {{getFbAccountLastName()}}!</h3>
                        </v-card-title>
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
                    <v-card v-else class="LoginCard demo-card-event mdl-card mdl-shadow--2dp">
                        <v-card-title primary-title>
                            <h3 class="headline mb-0">See You Soon</h3>
                        </v-card-title>
                        <v-card-text>
                            <div>To proceed, please log into your Facebook account by
                                <br/> selecting the Log In button below.</div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop="onFbLogin" flat color="orange">
                                <v-icon>account_box</v-icon> Log in to Facebook</v-btn>
                            <v-btn flat color="orange">About</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-layout>
            </v-slide-y-transition>
        </v-container>
    </v-content>
</template>

<script>
    export default {
        name: 'Login',
        components: {},
        // props: ['FbResponse'],
        data() {
            return {
                message: '',
                items: [],
                RedirectTimer: null,
                TimerCountdown: 5,
                isAutoLogin: true
            }
        },
        mounted: function () {
            console.log('event: login.mounted');
            if (!window.FbAccount) {
                // get Fb login status if not registered in window
                FB.getLoginStatus(this.handleFbLoginResponse);
            }
        },
        methods: {
            getFbAccountLastName: function () {
                return window.FbAccount.LastName;
            },
            isLoggedIn: function () {
                //  this.$router.push('home');
                console.log('method: login.isLoggedIn');
                return window.FbAccount;
            },
            handleFbLoginResponse: function (resp) {
                console.log(resp);
                var self = this;
                // sanity check on data format
                if ('authResponse' in resp) {
                    if (resp.status === 'connected') {
                        console.log('Logged in');
                        FB.api('/me', 'get', {
                            fields: 'last_name, first_name'
                        }, function (resp) {
                            if (!resp && resp.error)
                                console.error('error in response: ', resp.error);
                            else {
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
                        if (this.isAutoLogin) {
                            // only auto login once per page load
                            this.isAutoLogin = false;
                            this.onFbLogin();
                        }
                    }
                } else {
                    console.error('Invalid response object received in login.handleFbLoginResponse: ', resp);
                }
            },
            onFbLogin: function () {
                FB.login(this.handleFbLoginResponse, {
                    scope: 'user_photos, public_profile'
                });
            },
            onFbLogout: function () {
                var self = this;
                FB.logout(function (response) {
                    // Person is now logged out
                    delete window.FbAccount;
                    console.log('Logged out');
                    self.$forceUpdate();
                });
            }
        }
    }
</script>