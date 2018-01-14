<style>
.LoginCard {
    margin-left:auto; 
    margin-right:auto;
}
</style>
<template>
    <div>
        <br/>
        <div v-if="isLoggedIn()" class="LoginCard demo-card-event mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title mdl-card--expand" style="background-color: #cc0">
                Welcome
            </div>
            <div class="mdl-card__supporting-text">
                You are logged into Facebook. You will be redirected to select your albums in 5secs. If this is not your account, select
                the Log Out button below now.
            </div>

            <div class="mdl-card__actions mdl-card--border">
                <button v-on:click="onFbLogout" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect">
                    <i class="material-icons">exit_to_app</i> Log Off Facebook
                </button>
            </div>
        </div>
        <div v-else class="LoginCard demo-card-event mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title mdl-card--expand" style="background-color: #cc0">
                See You Soon
            </div>
            <div class="mdl-card__supporting-text">
                To proceed, please log into your Facebook account by selecting the Log In button below.
                <br/>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button v-on:click="onFbLogin" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect">
                    <i class="material-icons">account_box</i> Log In to Facebook
                </button>
            </div>
        </div>
    </div>
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
                isAutoLogin: true,
                FbAccount: window.FbAccount
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
                        window.FbAccount = resp.authResponse;
                        this.FbAccount = resp.authResponse;
                        self.$forceUpdate();
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
                FB.login(this.handleFbLoginResponse);
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