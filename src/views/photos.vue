<style>
    .scrollDown {
        background-position: 0 -200px;
        -webkit-transition: background-position .5s ease-in;
        -moz-transition: background-position .5s ease-in;
        -o-transition: background-position .5s ease-in;
        transition: background-position 5s ease-in;
    }

    .PhotoStyle {
        background-color: #c0c;
        background-size: cover;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        position: absolute;
    }

    .PhotoOverlayBase {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        backgroundColor: rgba(0, 0, 0, 0);
        transition: background-color .5s linear;
    }

    .DebugBlock {
        position: absolute;
        right: 20px;
        bottom: 40px;
        width: 40%;
        height: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ccc;
    }

    .BlackBackground {
        background-color: #000;
    }
</style>

<template>
    <div>
        <div id="photo" v-bind:style="PhotoSlideStyle" class="PhotoStyle"></div>
        <div v-bind:class="{PhotoOverlayBase: true, BlackBackground: isBlackBackground}">
                <v-btn slot="activator" @click="isShowMenu = true" flat icon color="pink" style="position: absolute; right: 10px; top: 10px">
                    <v-icon>favorite</v-icon>
                </v-btn>
            <v-menu offset-y absolute bottom right v-model="isShowMenu">
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title>Title</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
                <v-btn flat icon color="pink" style="position: absolute; right: 10px; bottom: 10px">
                    <v-icon>add</v-icon>
                </v-btn>
        </div>
        <div class="DebugBlock">
            <div v-for="msg in DebugMessages" style="white-space:nowrap; overflow: hidden">{{msg}}</div>
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
                MaxDebugMessages: 10,
                DebugMessages: [],
                MaxPhotoCount: 100,
                CurrentPhotoIdx: 0,
                PhotoSlideStyle: {},
                isShowMenu: false,
                isBlackBackground: true
            }
        },
        beforeRouteLeave(to, from, next) {
            this.debug('photos.beforeRouteLeave()');
            // approve the route out
            next();
        },
        beforeMount() {
            // sanity checks
            this.debug('event: photos.beforeMount');
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
            this.$store.commit('showFooter', false);
            var PhotoEl = document.getElementById('photo');
            if (PhotoEl) {
                // remove prior listeners on #photo
                console.log('photos.removeEventListener: %s', PhotoEl.removeEventListener('transitionend', this.onTransitionEnd));
                PhotoEl.addEventListener('transitionend', this.onTransitionEnd);
            }
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
            onTransitionEnd(evt) {
                this.debug('photos.onTransitionEnd');

                // set next photo index
                if (this.CurrentPhotoIdx == this.photos.length - 1) {
                    this.CurrentPhotoIdx = 0;
                } else
                    this.CurrentPhotoIdx++;

                // wait a while
                var self = this;
                setTimeout(() => {
                    // fade 2 black
                    this.isBlackBackground = true;
                    setTimeout(() => {
                        // reset background image position
                        self.PhotoSlideStyle = {};
                        self.showPhoto();
                    }, 2 * 1000);
                }, 1 * 1000);
            },
            debug(msg) {
                this.DebugMessages.push(msg);
                console.log('Debug: %s', msg);
                if (this.DebugMessages.length > this.MaxDebugMessages) {
                    this.DebugMessages.shift();
                }
            },
            reallyShowPhoto() {
                // load image into display block
                var CurrentPhoto = this.photos[this.CurrentPhotoIdx].images[0];
                this.debug('index: ' + this.CurrentPhotoIdx + ', ' + CurrentPhoto.source);
                this.PhotoSlideStyle = {
                    backgroundImage: 'url(\'' + CurrentPhoto.source + '\')'
                }

                // unhide display block
                this.isBlackBackground = false;

                var self = this;
                setTimeout(() => {
                    // calculate sliding action
                    var ParentAspectRatio = this.getWidth() / this.getHeight();
                    var PhotoAspectRatio = CurrentPhoto.width / CurrentPhoto.height;
                    self.debug('Parent aspect ratio: ' + ParentAspectRatio + '<br/>' +
                        'photo aspect ratio: ' + PhotoAspectRatio);

                    if (PhotoAspectRatio < ParentAspectRatio) {
                        // scroll vertical
                        var ScrollHeight = -1 * (parseInt(self.getWidth() / CurrentPhoto.width * CurrentPhoto.height) -
                            self.getHeight());
                        self.debug('Scroll down ' + ScrollHeight + ' px');
                        self.PhotoSlideStyle = {
                            backgroundImage: 'url(\'' + CurrentPhoto.source + '\')',
                            transition: 'background-position-y 5s linear',
                            backgroundPositionY: ScrollHeight + 'px'
                        };
                    } else {
                        // scroll horizontal
                        var ScrollWidth = -1 * (parseInt(CurrentPhoto.width / CurrentPhoto.height * self.getHeight()) -
                            self.getWidth());
                        self.debug('Scroll right ' + ScrollWidth + ' px');
                        self.PhotoSlideStyle = {
                            transition: 'background-position-x 5s linear',
                            backgroundPositionY: ScrollWidth + 'px'
                        };
                    }
                }, 1 * 500);
            },
            showPhoto() {
                // reset image position

                // load image into memory
                var image = document.createElement('img');
                var self = this;
                image.addEventListener('load', (evt) => {
                    self.debug('Image loaded');
                    image.remove();
                    self.reallyShowPhoto();
                });

                // load image
                var CurrentPhoto = this.photos[this.CurrentPhotoIdx].images[0];
                this.debug('Loading ' + this.CurrentPhotoIdx + ':' + CurrentPhoto.source + '...');
                image.src = CurrentPhoto.source;
            },
            loadFbPhotos: function (url) {
                this.debug('photos.loadFbPhotos()');
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
                        if (self.photos.length < self.MaxPhotoCount &&
                            resp.paging &&
                            resp.paging.next) {
                            // load next page of photo meta data
                            self.debug('Load next page of photo meta data');
                            self.loadFbPhotos(resp.paging.next);
                        } else {
                            // load the first photo
                            self.$store.commit('setDebugMessage', self.photos.length +
                                ' photo meta records loaded');
                            self.showPhoto();
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