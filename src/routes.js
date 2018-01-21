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
    },
    {
        path:'/albums',
        name:'albums',
        props: true,
        component: () => import ( /* webpackChunkName: "views" */ './views/albums.vue')
    },
    {
        path:'/photos',
        name:'photos',
        props: true,
        component: () => import ( /* webpackChunkName: "views" */ './views/photos.vue')
    },
    {
        path:'/login',
        name:'login',
        props: true,
        component: () => import ( /* webpackChunkName: "views" */ './views/login.vue')
    }

];

export default new Router({
    routes
});