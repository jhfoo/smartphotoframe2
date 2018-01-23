<style>
    .scrollDown {
        background-position: 0 -200px;
        -webkit-transition: background-position .5s ease-in;
        -moz-transition: background-position .5s ease-in;
        -o-transition: background-position .5s ease-in;
        transition: background-position 5s ease-in;
    }
</style>

<template>
    <div>
        <div v-bind:style="PhotoStyle" v-bind:class="TransitClass">{{ImageUrl}}
            <br/>{{debug}}
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
                ImageUrl: '',
                debug: '',
                TransitClass: '',
                PhotoStyle: {
                    backgroundColor: '#c0c',
                    backgroundSize: 'cover',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'absolute'
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            console.log('photos.beforeRouteLeave()');
            // approve the route out
            next();
        },
        beforeMount() {
            // sanity checks
            console.log('event: photos.beforeMount');
            if (!window.FbAccount) {
                this.$store.commit('setDebugMessage', 'ERROR: window.FbAccount is falsey');
                this.$router.push('login');
            }
            // AlbumId must be passed in: this page cannot be loaded directly
            if (!this.AlbumId) {
                this.$store.commit('setDebugMessage', 'ERROR: Missing AlbumId');
                this.$router.push('albums');
            }
            console.log('AlbumId: ', this.AlbumId);
        },
        beforeRouteEnter(to, from, next) {
            console.log('Entering photo route');
            next(vm => {
                // vm.$store.commit('setAppbar',false);
            });
        },
        mounted: function () {
            this.$store.commit('setAppbar', false);
            this.loadFbPhotos();
        },
        updated: function () {
            console.log('photos.updated()');
        },
        methods: {
            getWidth() {
                return Math.max(
                    document.body.scrollWidth,
                    document.documentElement.scrollWidth,
                    document.body.offsetWidth,
                    document.documentElement.offsetWidth,
                    document.documentElement.clientWidth
                );
            },
            getHeight() {
                return Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight,
                    document.documentElement.clientHeight
                );
            },
            showPhotos() {
                var ParentAspectRatio = this.getWidth() / this.getHeight();
                this.ImageUrl = this.photos[0].images[0].source;
                console.log('url(\'' + this.photos[0].images[0].source + '\')');
                this.PhotoStyle.backgroundImage = 'url(\'' + this.photos[0].images[0].source +
                    '\')';
                var PhotoAspectRatio = this.photos[0].images[0].width / this.photos[0].images[0].height;
                if (PhotoAspectRatio < ParentAspectRatio) {
                    // scroll vertical
                    this.PhotoStyle.transition = 'background-position 5s linear';
                    var ScrollHeight = parseInt(this.getWidth()/ this.photos[0].images[0].width * this.photos[0].images[0].height)  - this.getHeight();
                    this.PhotoStyle.backgroundPosition = '0px -' + ScrollHeight + 'px';
                    // this.TransitClass = "scrollDown";
                    // this.PhotoStyle.backgroundPosition = '0px -250px';
                } else {
                    // scroll horizontal
                }
                this.debug = 'Parent aspect ratio: ' + ParentAspectRatio + '<br/>' +
                    'photo aspect ratio: ' + PhotoAspectRatio;
                // self.$store.commit('setDebugMessage', 'Redirecting to dummy');
                // setTimeout(() => {
                //     console.log('route to dummy');
                //     self.$router.push('dummy');
                // }, 3 * 1000);
            },
            loadFbPhotos: function (url) {
                console.log('photos.loadFbPhotos()');
                this.$store.commit('setDebugMessage', 'Loading photo meta data...');
                var self = this;
                const GetLimit = 5;
                url = url ? url : '/' + this.AlbumId + '/photos?limit=' + GetLimit;
                FB.api(url, 'get', {
                    fields: 'created_time, name, link, from, images'
                }, function (resp) {
                    if (resp.error) {
                        console.error('error in response: ', resp.error);
                        if (resp.error.message)
                            this.$store.commit('setDebugMessage', 'ERROR: ' + resp.message);
                        // try logging in again
                        self.$router.push('login');
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
                            // load next page of photo meta data
                            self.loadFbPhotos(resp.paging.next);
                        } else {
                            // load the first photo
                            self.$store.commit('setDebugMessage', 'Photo meta data loaded');
                            self.showPhotos();
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