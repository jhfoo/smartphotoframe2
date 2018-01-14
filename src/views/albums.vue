<template>
    <div>
        Album list
    </div>
</template>

<script>
    export default {
        name: 'Albums',
        components: {},
        props: ['FbResponse'],
        data() {
            return {
                message: '',
                items: []
            }
        },
        beforeMount: function () {
            console.log('event: albums.beforeMount');
            if (!window.FbAccount) {
                this.$router.push('login');
            }
        },
        methods: {
            isLoggedIn: function () {
                //  this.$router.push('home');
                return false;
                return this.FbResponse.status === 'connected';
            },
            onFbLogin: function () {
                FB.login(function (resp) {
                    console.log(resp);
                    if (resp.status === 'connected') {
                        // Logged into your app and Facebook.
                    } else {
                        // The person is not logged into this app or we are unable to tell. 
                    }
                });
            },
            onFbLogout: function () {
                FB.logout(function (response) {
                    // Person is now logged out
                    console.log('Logged out');
                });
            }
        }
    }
</script>