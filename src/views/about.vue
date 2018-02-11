<style>
    .AboutBlock {
        padding-top: 80px;
        padding-bottom: 50px;
    }
</style>

<template>
    <v-container class="AboutBlock">
        <v-layout row>
            <v-flex xs7>
                <v-card>
                    <v-card-text>
                        <h3 class="headline mb-0">Capabilities</h3>
                        <div v-if="hasLocalStorage">Browser storage is supported on your browser.</div>
                        <div v-if="isSupportedBrowser">Your browser is supported for this app.</div>
                        <div v-else>Your browser is not supported for this app; some functionality may not work.</div>
                        <br/>
                        <h3 class="headline mb-0">FAQ</h3>
                        <strong>What is SMARTPhotoFrame?</strong>
                        <p>This is a pure browser-based photo display app, connecting to Facebook and displays photos uploaded
                            by the user-supplied Facebook account</p>
                        <strong>Is it safe to link my Facebook account to this app?</strong>
                        <p>While the codes are stored on a public server on the Internet, the server does little more than host
                            them for the browser to download. Simply put, neither your account information nor your selection
                            preferences are stored in the server.</p>
                        <strong>I don't believe you. Show me your codes!</strong>
                        <p>Check them out
                            <a href="https://github.com/jhfoo/smartphotoframe2">on GitHub</a>!</p>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs4 offset-xs1>
                <v-card>
                    <v-card-media src="/images/about-header.jpg" height="200px">
                    </v-card-media>
                    <v-card-text>
                        <h3 class="headline mb-0">SMARTPhotoFrame</h3>
                        <div style="text-align:right">v{{$store.state.version}}</div>
                        Developed by FOO, Ji-Haw
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="$router.back()" flat color="orange">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: 'About',
        components: {},
        props: [],
        data() {
            return {}
        },
        computed: {
            hasLocalStorage() {
                return window.localStorage;
            },
            isSupportedBrowser() {
                return (navigator.userAgent.indexOf('Firefox') ||
                    navigator.userAgent.indexOf('Chrome'));
            }
        },
        methods: {}
    }
</script>