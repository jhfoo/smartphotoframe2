import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        LeftDrawer: {
            isShow: false
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
        setDebugMessage(state, NewMsg) {
            NewMsg = NewMsg ? NewMsg : '';
            state.DebugMessage = NewMsg;
        }
    }
});