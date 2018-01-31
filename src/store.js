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
        debug: {
            isShow: true,
            MaxMessages: 10,
            messages: []
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
        toggleDebugWindow(state) {
            state.debug.isShow = !state.debug.isShow;
        },
        addDebugMessage(state, NewMsg) {
            console.log('Debug: ' + NewMsg);
            var rec = {
                msg: NewMsg,
                // create random id
                id: (function (MaxLength) {
                    var ret = '';
                    for (var i = 0; i < MaxLength; i++) {
                        ret += Math.floor(Math.random() * 10);
                    }
                    return ret;
                })(6)
            }
            state.debug.messages.push(rec);
            if (state.debug.messages.length > state.debug.MaxMessages)
                state.debug.messages.shift();
        },
        setDebugMessage(state, NewMsg) {
            NewMsg = NewMsg ? NewMsg : '';
            state.DebugMessage = NewMsg;
        }
    }
});