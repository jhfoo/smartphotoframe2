<style>
    .AlbumCard {
        float: left;
        width: 200px;
        margin: 10px;
    }

    .CardOverlayBlock {
        background-color: rgba(0, 0, 0, 0.7);
        width: 100%;
        margin-top: 110px;
    }

    .CardText {
        color: #a7a7a7;
        padding: 10px 10px 0 10px;
    }

    .CardText>.CardTitle {
        font-size: 18px;
        padding-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
    }
</style>

<template>
    <div style="padding-top:50px; padding-bottom: 50px">
        <div v-if="isAutoAlbumTimerStarted">In {{AutoLoadSec}}secs the latest album will be loaded.
            <br/>
        </div>
        <v-card v-for="item in orderByLatest(5)" v-bind:key="item.id" class="AlbumCard">
            <v-card-media :src="item.PhotoSrc" height="250px">
                <div class="CardOverlayBlock">
                    <div class="CardText">
                        <div class="CardTitle" v-text="item.name"></div>
                        <div>
                            Updated {{ item.UpdatedDateTime }}
                            <br> {{ item.count }} photo(s)
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.stop="selectAlbum(item.id)" flat color="orange">
                            <v-icon>exit_to_app</v-icon>Select</v-btn>
                    </v-card-actions>
                </div>
            </v-card-media>
        </v-card>
        <div style="clear:both"></div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {
        mapMutations
    } from 'vuex';

    export default {
        name: 'Albums',
        components: {},
        props: ['FbResponse'],
        data() {
            return {
                message: '',
                albums: [],
                isAutoAlbumTimerStarted: false,
                AutoLoadSec: 0,
                AutoLoadTimeoutSec: 0,
                AutoLoadTimer: null,
                ListStyle: {

                }
            }
        },
        beforeMount: function () {
            this.setDebugMessage('event: albums.beforeMount');
            if (!window.FbAccount) {
                this.$router.push('login');
            }
        },
        mounted: function () {
            this.$store.commit('setAppbar', true);
            this.$store.commit('showFooter', true);
            this.loadFbAlbums();
        },
        computed: {},
        methods: {
            ...mapMutations(['addDebugMessage', 'addErrorMessage', 'setDebugMessage']),
            getLatestPhotoSrc(item) {
                return '';
            },
            orderByLatest(MaxAlbums) {
                MaxAlbums = MaxAlbums ? MaxAlbums : 5;
                return this.albums.filter((item, index) => {
                    return index < MaxAlbums;
                });
            },
            getAlbumCount: function () {
                return this.albums.length;
            },
            selectAlbum(AlbumId) {
                // auto full screen
                this.addDebugMessage('isAutoFullscreen: ' + this.$store.state.isAutoFullscreen);
                if (this.$store.state.isAutoFullscreen)
                    this.setFullscreen();

                this.$router.push({
                    name: 'photos',
                    params: {
                        AlbumId: AlbumId
                    }
                });
            },
            setFullscreen() {
                this.addDebugMessage('Switching to full screen...');
                if (navigator.userAgent.indexOf('Firefox') > -1)
                    // Firefox handling
                    if (!document.mozFullScreen) {
                        this.addDebugMessage('Firefox full screen');
                        document.documentElement.mozRequestFullScreen();
                    }
                else if (navigator.userAgent.indexOf('Chrome') > -1)
                    // Chrome handling
                    if (!document.webkitFullscreenElement) {
                        this.addDebugMessage('Chrome full screen');
                        document.body.webkitRequestFullScreen();
                    }
                else
                    // Unsupported browsers
                    this.addDebugMessage('Unsupported browser');
            },
            populateAlbumPhoto(album) {
                var self = this;
                FB.api('/' + album.id + '/photos?limit=1', 'get', {
                    fields: 'created_time, name, link, from, images'
                }, function (resp) {
                    if (resp.error) {
                        self.setDebugMessage('ERROR: ' + resp.error);
                        if (resp.error.message)
                            self.addErrorMessage('ERROR: ' + resp.message);
                        // try logging in again
                        self.$router.push('login');
                    } else {
                        album.PhotoSrc = resp.data[0].images[0].source;
                        self.$forceUpdate();
                        // self.setDebugMessage(album.PhotoSrc);
                    }
                });
            },
            handleFbAlbumResponse(resp) {
                var self = this;
                console.log(this);
                if (!resp || resp.error) {
                    self.addErrorMessage('error in response: ' + JSON.stringify(resp.error));
                    self.setDebugMessage('ERROR: ' + resp.error.message);
                    // try logging in again
                    this.$router.push('login');
                } else {
                    self.addDebugMessage('response: ' + JSON.stringify(resp));
                    self.setDebugMessage('Loading ' + (self.albums.length + resp.data.length) +
                        ' albums...');
                    resp.data.forEach(item => {
                        item.UpdatedDateTime = moment(item.updated_time).format('D MMM, YYYY');
                        item.UpdatedDateTimeUnix = moment(item.updated_time).unix();
                    });
                    self.albums = self.albums.concat(resp.data).sort((a, b) => {
                        if (a.UpdatedDateTimeUnix < b.UpdatedDateTimeUnix)
                            return 1;
                        else if (b.UpdatedDateTimeUnix < a.UpdatedDateTimeUnix)
                            return -1;
                        return 0;
                    });
                    if (resp.paging && resp.paging.next) {
                        self.loadFbAlbums(resp.paging.next);
                    } else {
                        // done loading pages
                        self.setDebugMessage(self.albums.length + ' albums loaded');

                        // load the first photo in album
                        console.log(self);
                        for (var i = 0; i < 5; i++) {
                            self.populateAlbumPhoto(self.albums[i]);
                        }

                        // no autoload if there are no albums
                        if (self.albums.length && self.AutoLoadTimeoutSec) {
                            self.AutoLoadSec = self.AutoLoadTimeoutSec;
                            self.AutoLoadTimer = setInterval(() => {
                                self.AutoLoadSec--;
                                if (self.AutoLoadSec === 0) {
                                    clearInterval(self.AutoLoadTimer);
                                    self.isAutoAlbumTimerStarted = false;
                                    self.selectAlbum(self.albums[0].id);
                                } else {
                                    self.setDebugMessage('Auto-redirect in ' + self.AutoLoadSec +
                                        'secs...');
                                }
                            }, 1000);
                            self.isAutoAlbumTimerStarted = true;
                        }
                    }
                }
            },
            loadFbAlbums(url) {
                var self = this;
                const GetAlbumLimit = 5;
                url = url ? url : '/me/albums?limit=' + GetAlbumLimit;
                FB.api(url, 'get', {
                    fields: 'updated_time, created_time, name, count'
                }, this.handleFbAlbumResponse);
            },
            isLoggedIn: function () {
                //  this.$router.push('home');
                return false;
                return this.FbResponse.status === 'connected';
            }
        }
    }
</script>