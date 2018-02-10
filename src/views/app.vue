<style>
    html {
        overflow-y: auto
    }
</style>

<template>
    <v-app>
        <Appbar></Appbar>
        <router-view></router-view>
        <Footer></Footer>
        <DebugWin></DebugWin>
    </v-app>
</template>

<script>
    import Appbar from './appbar.vue';
    import Footer from './footer.vue';
    import DebugWin from './debugwin.vue';

    export default {
        mounted: function() {
            // load stored preferences if avail
            if (window.localStorage) {
                var StoredConfig = window.localStorage.getItem('config');
                if (StoredConfig) {
                    console.log(StoredConfig);
                    this.$store.commit('setConfig', StoredConfig);
                } else {
                    console.log('No config stored in browser');
                }
            }
        },
        components: {
            Appbar, Footer, DebugWin
        },
        computed: {
            getCount: {
                get: function() {
                    return this.$store.state.LeftDrawer.isShow;
                },
                set: function(NewValue) {
                    this.$store.commit('setLeftDrawer', NewValue);
                }
            }
        },
        data() {
            return {
                clipped: false,
                drawer: true,
                fixed: false,
                items: [{
                    icon: 'bubble_chart',
                    title: 'Inspire'
                }],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'SMARTPhotoFrame 2'
            }
        }
    }
</script>