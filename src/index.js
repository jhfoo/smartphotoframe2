import Vue from 'vue';
import store from './store';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'axios';
import VueRouter from 'vue-router';
import router from './routes';
import App from './views/app.vue';
import Drawer from './views/drawer.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

// init fb
var self = this;
const Config = {
    facebook: {
        AppId: '1419591801401458'
    }
};

window.fbAsyncInit = function () {
    FB.init({
        appId: '1419591801401458',
        xfbml: true,
        version: 'v2.11'
    });

    const VueApp = initVue();
    // FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


Vue.use(VueRouter);

function initVue() {
    return new Vue({
        el: '#root',
        components: {
            Drawer
        },
        store,
        render: h => h(App),
        router: router,
        data: {
            ListStyle: 'color: #ee0',
            message: 'Awesome!',
            items: [{
                    name: 'foo'
                },
                {
                    name: 'joe'
                },
                {
                    name: 'tammy'
                }
            ]
        },
        methods: {
            onAdd() {
                this.items.push({
                    name: 'new person'
                });
                this.message = '';
                this.ListStyle = 'color: #0e0';
            }
        },
        mounted() {}
    });
}