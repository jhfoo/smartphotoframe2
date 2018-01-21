<style>
    .AlbumCard {
        float: left;
        width: 250px;
        margin: 10px;
    }
</style>

<template>
    <div>
        Recently updated albums ({{getAlbumCount()}} total)
        <br/>
        <div v-if="isAutoAlbumTimerStarted">In {{AutoLoadSec}}secs the latest album will be loaded.</div>
        <br/>
        <v-card v-for="item in orderByLatest(5)" v-bind:key="item.id" class="AlbumCard">
            <v-card-title primary-title>
                <h3 class="headline mb-0">{{ item.name }}</h3>
            </v-card-title>
            <v-card-text>
                Updated {{ item.UpdatedDateTime }}
                <br> {{ item.count }} photo(s)
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click.stop="onFbLogout" flat color="orange">
                    <v-icon>exit_to_app</v-icon>Select</v-btn>
            </v-card-actions>
        </v-card>
        <div style="clear:both"></div>
    </div>
</template>

<script>
    import moment from 'moment';

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
                AutoLoadTimer: null,
                ListStyle: {

                }
            }
        },
        beforeMount: function () {
            console.log('event: albums.beforeMount');
            if (!window.FbAccount) {
                this.$router.push('login');
            }
        },
        mounted: function () {
            this.loadFbAlbums();
        },
        methods: {
            orderByLatest: function (MaxAlbums) {
                MaxAlbums = MaxAlbums ? MaxAlbums : 5;
                return this.albums.filter((item, index) => {
                    return index < MaxAlbums;
                });
            },
            getAlbumCount: function () {
                return this.albums.length;
            },
            loadFbAlbums: function (url) {
                var self = this;
                const GetAlbumLimit = 5;
                url = url ? url : '/me/albums?limit=' + GetAlbumLimit;
                FB.api(url, 'get', {
                    fields: 'updated_time, created_time, name, count'
                }, function (resp) {
                    if (!resp || resp.error) {
                        console.error('error in response: ', resp.error);
                        // try logging in again
                        this.$router.push('login');
                    } else {
                        console.log('response: ', resp);
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
                            // no autoload if there are no albums
                            if (self.albums.length) {
                                self.AutoLoadSec = 5;
                                self.AutoLoadTimer = setInterval(() => {
                                    self.AutoLoadSec--;
                                    if (self.AutoLoadSec === 0) {
                                        clearInterval(self.AutoLoadTimer);
                                        self.isAutoAlbumTimerStarted = false;
                                        self.$router.push({
                                            name: 'photos',
                                            params: {
                                                AlbumId: self.albums[0].id
                                            }
                                        });
                                    };
                                }, 1000);
                                self.isAutoAlbumTimerStarted = true;
                            }
                        }
                    }
                });
            },
            isLoggedIn: function () {
                //  this.$router.push('home');
                return false;
                return this.FbResponse.status === 'connected';
            }
        }
    }
</script>