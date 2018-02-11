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
            MaxMessages: 30,
            messages: []
        },
        hasLocalStorage: false,
        isAutoLogin: true,
        isAutoFullscreen: true,
        isFullscreen: false,
        DebugMessage: '',
        AppTitle: 'Woohoo',
        version: '[AIV]{version}[/AIV]'
    },
    getters: {
        isShowDebugWin(state) {
            return state.debug.isShow;
        },
        isAutoLogin(state) {
            return state.isAutoLogin;
        }
    },
    mutations: {
        setConfig(state, NewConfig) {
            NewConfig = JSON.parse(NewConfig);
            state.isAutoLogin = NewConfig.isAutoLogin;
            state.debug.isShow = NewConfig.isShowDebugWin;
            state.hasLocalStorage = true;
        },
        setFullscreen(state, NewValue) {
            state.isFullscreen = NewValue;
            console.log('store.isFullscreen: ' + NewValue);
        },
        isAutoUpdateLocalStore(state, NewValue) {
            state.isAutoUpdateLocalStore = NewValue;
        },
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
        toggleAutoLogin(state) {
            state.isAutoLogin = !state.isAutoLogin;
            window.localStorage.setItem('config', JSON.stringify({
                isAutoLogin: state.isAutoLogin,
                isShowDebugWin: state.debug.isShow
            }));
        },
        toggleDebugWindow(state) {
            state.debug.isShow = !state.debug.isShow;
            window.localStorage.setItem('config', JSON.stringify({
                isAutoLogin: state.isAutoLogin,
                isShowDebugWin: state.debug.isShow
            }));
        },
        addDebugMessage(state, NewMsg) {
            console.log('Debug: ' + NewMsg);
            var rec = {
                msg: NewMsg,
                type:'debug',
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
        addErrorMessage(state, NewMsg) {
            console.error(NewMsg);
            var rec = {
                msg: NewMsg,
                type:'error',
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