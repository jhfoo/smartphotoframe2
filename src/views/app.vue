<style>
    html {
        overflow-y: auto
    }
</style>

<template>
    <v-app>
        <v-navigation-drawer fixed :mini-variant="miniVariant" :clipped="clipped" v-model="getCount" app>
            <v-toolbar flat>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title class="title">Hello</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list>
                <v-list-tile value="true" v-for="(item, i) in items" :key="i">
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <Appbar></Appbar>
        <router-view></router-view>

        <Footer></Footer>
    </v-app>
</template>

<script>
    import Appbar from './appbar.vue';
    import Footer from './footer.vue';

    export default {
        components: {
            Appbar, Footer
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