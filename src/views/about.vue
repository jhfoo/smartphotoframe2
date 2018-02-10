<style>
    .AboutBlock {
        width: 400px;
        margin-left: auto;
        margin-right: auto;
        padding-top: 80px;
        padding-bottom: 50px;
    }
</style>

<template>
    <div class="AboutBlock">
        <v-card>
            <v-card-media src="/images/about-header.jpg" height="200px">
            </v-card-media>
            <v-card-title primary-title>
                <h3 class="headline mb-0">SMARTPhotoFrame</h3>
            </v-card-title>
            <v-card-text>
                For more information visit the <a href="https://github.com/jhfoo/smartphotoframe2">GitHub repository</a>.
                <br/>
                <br/>
                <div v-if="hasLocalStorage">Browser storage is supported on your browser.</div>
                <div v-if="isSupportedBrowser">Your browser is supported for this app.</div>
                <div v-else>Your browser is not supported for this app; some functionality may not work.</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="$router.back()" flat color="orange">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </div>
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
                return (navigator.userAgent.indexOf('Firefox')
                    || navigator.userAgent.indexOf('Chrome'));
            }
        },
        methods: {}
    }
</script>