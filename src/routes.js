import Router from 'vue-router';

const Home = () => import ( /* webpackChunkName: "views" */ './views/home.vue');

var routes = [
    {
        path:'/',
        name: 'home',
        component: Home
    },
    {
        path:'/stuff',
        component: () => import ( /* webpackChunkName: "stuff" */ './views/dummy.vue')
    }

];

export default new Router({
    routes
});