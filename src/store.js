import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        LeftDrawer: {
            isShow: false
        },
        Appbar: {
            isShow: true
        },
        footer: {
            isShow: true
        },
        DebugMessage: '',
        AppTitle: 'Woohoo',
        version: '[AIV]{version}[/AIV]'
    },
    mutations: {
        setLeftDrawer(state, isShow) {
            isShow = isShow ? isShow : false;
            state.LeftDrawer.isShow = isShow;
        },
        setAppbar(state, isShow) {
            console.log('store.setappbar: ', isShow);
            isShow = isShow ? isShow : false;
            state.Appbar.isShow = isShow;
        },
        showFooter(state, isShow) {
            console.log('store.showfooter: ', isShow);
            isShow = isShow ? isShow : false;
            state.footer.isShow = isShow;
        },
        setDebugMessage(state, NewMsg) {
            NewMsg = NewMsg ? NewMsg : '';
            state.DebugMessage = NewMsg;
        }
    }
});