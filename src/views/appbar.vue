<style>
</style>

<template>
    <v-toolbar v-if="isShow" fixed app>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y class="MiniMenu">
            <v-btn slot="activator" flat icon style="">
                <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
                <v-subheader>Options</v-subheader>
                <v-list-tile @click="$router.push('about')">
                    <v-list-tile-action>
                        <v-icon color="pink">help</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>About</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="$router.back()">
                    <v-list-tile-action>
                        <v-icon color="pink">perm_media</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Albums</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="toggleFullscreen()">
                    <v-list-tile-action>
                        <v-switch v-model="FullscreenStatus"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Toggle Fullscreen</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="toggleAutoLogin()">
                    <v-list-tile-action>
                        <v-switch v-model="AutoLoginStatus"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Toggle Auto Login</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="toggleDebugWindow()">
                    <v-list-tile-action>
                        <v-switch v-model="DebugWinStatus"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Toggle Debug Mode</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="onLogout()">
                    <v-list-tile-action>
                        <v-icon color="pink">power_settings_new</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Log Off</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script>
    import {
        mapMutations, mapGetters
    } from 'vuex';
    import {ScreenToggle} from '../mixins/screentoggle';

    export default {
        mixins:[ScreenToggle],
        data() {
            return {
                title: 'SMARTPhotoFrame'
            }
        },
        computed: {
            FullscreenStatus: {
                get: function() {
                    console.log ('FullscreenStatus GET');
                    return this.$store.state.isFullscreen;
                },
                set: function(NewValue) {
                    console.log ('FullscreenStatus SET');
                }
            },
            DebugWinStatus: {
                get: function() {
                    return this.isShowDebugWin();
                },
                set: function(NewValue) {
                    // console.log('DebugWinStatus.SET');
                    // this.toggleDebugWindow();
                }
            },
            AutoLoginStatus: {
                get: function() {
                    return this.isAutoLogin();
                },
                set: function(NewValue) {

                }
            },
            isShow() {
                console.log('appbar.isShow:', this.$store.state.Appbar.isShow);
                return this.$store.state.Appbar.isShow;
            }
        },
        methods: {
            ...mapMutations(['addDebugMessage', 'addErrorMessage', 'toggleDebugWindow', 'toggleAutoLogin',
                'setFullscreen']),
            ...mapGetters(['isShowDebugWin', 'isAutoLogin']),
            onLogout() {
                this.$router.push({
                    name: 'login',
                    params: {
                        isLogout: true
                    }
                })
            },
            isFullscreen() {
                this.addDebugMessage(navigator.userAgent);
                return this.$store.state.isFullscreen;
                // if (navigator.userAgent.indexOf('Firefox') > -1) {
                //     // Firefox handling
                //     console.log('fullscreenElement: ' + document.fullscreenElement);
                //     console.log('mozFullScreen: ' + document.mozFullScreen);
                //     return document.mozFullScreen === true;
                // }
                // else if (navigator.userAgent.indexOf('Chrome') > -1) {
                //     console.log('webkitFullscreenElement: ' + document.webkitFullscreenElement);
                //     return document.webkitFullscreenElement !== null;
                // }
            }
        }
    }
</script>