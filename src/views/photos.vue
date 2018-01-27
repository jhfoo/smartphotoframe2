<style>
    .scrollDown {
        background-position: 0 -200px;
        -webkit-transition: background-position .5s ease-in;
        -moz-transition: background-position .5s ease-in;
        -o-transition: background-position .5s ease-in;
        transition: background-position 5s ease-in;
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

    .BlackBackground {
        background-color: #000;
    }
</style>

<template>
    <div>
        <div id="photo" v-bind:style="PhotoStyle">{{debug}}
        </div>
        <div v-bind:class="{PhotoOverlayBase: true, BlackBackground: isBlackBackground}">Overlay
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
                once: true,
                message: '',
                photos: [],
                MaxPhotoCount: 20,
                debug: '',
                DebugCount: 3,
                CurrentPhotoIdx: 0,
                PhotoStyle: {
                    backgroundColor: '#c0c',
                    backgroundSize: 'cover',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'absolute'
                },
                isBlackBackground: true
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
            if (this.once) {
                this.once = false;
                document.getElementById('photo').addEventListener('transitionend', this.onTransitionEnd);
            }
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
                console.log('photos.onTransitionEnd');
                // set next photo index
                if (this.CurrentPhotoIdx == this.photos.length - 1) {
                    this.CurrentPhotoIdx = 0;
                } else
                    this.CurrentPhotoIdx++;

                // fade 2 black
                this.isBlackBackground = true;
                var self = this;
                setTimeout(() => {
                    self.PhotoStyle = {
                        backgroundColor: '#c0c',
                        backgroundSize: 'cover',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        position: 'absolute'
                    };
                    self.showPhoto();
                }, 2 * 1000);
                // this.PhotoStyle.transition = 'none';
                // this.PhotoStyle.backgroundPosition = '0px 0px';
                // delete this.PhotoStyle.backgroundImage;
                console.log('photos.onTransitionEnd end');
                //this.$forceUpdate();
                // this.showPhoto();
            },
            reallyShowPhoto() {
                if (this.DebugCount) {
                    this.DebugCount--;

                    // load image into display block
                    var CurrentPhoto = this.photos[this.CurrentPhotoIdx].images[0];
                    console.log('index: %d, %s', this.CurrentPhotoIdx, CurrentPhoto.source);
                    this.PhotoStyle.backgroundImage = 'url(\'' + CurrentPhoto.source + '\')';

                    // unhide display block
                    this.isBlackBackground = false;

                    var self = this;
                    setTimeout(() => {
                        // calculate sliding action
                        var ParentAspectRatio = this.getWidth() / this.getHeight();
                        var PhotoAspectRatio = CurrentPhoto.width / CurrentPhoto.height;
                        self.debug = 'Parent aspect ratio: ' + ParentAspectRatio + '<br/>' +
                            'photo aspect ratio: ' + PhotoAspectRatio;

                        if (PhotoAspectRatio < ParentAspectRatio) {
                            // scroll vertical
                            self.PhotoStyle.transition = 'background-position 5s linear';
                            var ScrollHeight = parseInt(self.getWidth() / CurrentPhoto.width * CurrentPhoto.height) -
                                self.getHeight();
                            console.log('Scroll down %d px', ScrollHeight);
                            self.PhotoStyle.backgroundPosition = '0px -' + ScrollHeight + 'px';
                        } else {
                            // scroll horizontal
                        }
                    }, 1 * 500);
                }
            },
            showPhoto() {
                // reset image position

                // load image into memory
                var image = document.createElement('img');
                var self = this;
                image.addEventListener('load', (evt) => {
                    console.log('Image loaded');
                    image.remove();
                    self.reallyShowPhoto();
                });

                // load image
                var CurrentPhoto = this.photos[this.CurrentPhotoIdx].images[0];
                console.log('Loading %d:%s...', this.CurrentPhotoIdx, CurrentPhoto.source);
                image.src = CurrentPhoto.source;
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
                            self.CurrentPhotoIdx = 0;
                            self.loadFbPhotos(resp.paging.next);
                        } else {
                            // load the first photo
                            self.$store.commit('setDebugMessage', 'Photo meta data loaded');
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