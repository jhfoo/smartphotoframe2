<style>
    .CardStyle {
        float: left;
        width: 200px;
        margin: 10px;
    }
</style>

<template>
    <div>
        Photos
        <div v-bind:style="PhotoStyle">Image here
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'Photos',
        components: {},
        props: ['AlbumId'],
        data() {
            return {
                message: '',
                photos: [],
                MaxPhotoCount: 20,
                PhotoStyle: {
                    width: '500px',
                    height: '200px',
                    backgroundColor: '#c0c'
                }
            }
        },
        beforeMount: function () {
            // sanity checks
            console.log('event: photos.beforeMount');
            if (!window.FbAccount) {
                this.$router.push('login');
            }
            // AlbumId must be passed in: this page cannot be loaded directly
            if (!this.AlbumId) {
                this.$router.push('albums');
            }
            console.log('AlbumId: ', this.AlbumId);
        },
        mounted: function () {
            this.loadFbPhotos();
        },
        methods: {
            loadFbPhotos: function (url) {
                var self = this;
                const GetLimit = 5;
                url = url ? url : '/' + this.AlbumId + '/photos?limit=' + GetLimit;
                FB.api(url, 'get', {
                    fields: 'created_time, name, link, from, images'
                }, function (resp) {
                    if (!resp || resp.error) {
                        console.error('error in response: ', resp.error);
                        // try logging in again
                        this.$router.push('login');
                    } else {
                        console.log('response: ', resp);
                        console.log(resp.data[0].images);
                        console.log(resp.data[0].images[0].source);
                        resp.data.forEach(item => {
                            item.CreatedDateTime = moment(item.created_time).format('D MMM, YYYY');
                            item.CreatedDateTimeUnix = moment(item.created_time).unix();
                        });
                        // sort by photo.created_time desc
                        self.photos = self.photos.concat(resp.data).sort((a, b) => {
                            if (a.CreatedDateTimeUnix < b.CreatedDateTimeUnix)
                                return 1;
                            else if (b.CreatedDateTimeUnix < a.CreatedDateTimeUnix)
                                return -1;
                            return 0;
                        });
                        if (self.photos.length < self.MaxPhotoCount && resp.paging && resp.paging.next) {
                            self.loadFbPhotos(resp.paging.next);
                        } else {
                            console.log('url(\'' + self.photos[0].images[0].source + '\')');
                            self.PhotoStyle.backgroundImage = 'url(\'' + self.photos[0].images[0].source + '\')';
                            self.PhotoStyle.width = '450px';
                            self.PhotoStyle.backgroundSize = '450px';
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