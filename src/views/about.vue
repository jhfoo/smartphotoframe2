<style>
    .AboutBlock {
        width: 400px;
        margin-left: auto;
        margin-right: auto;
        padding-top: 100px;
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
            <v-card-text>For more information goto XXX.</v-card-text>
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
        methods: {}
    }
</script>