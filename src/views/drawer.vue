<template>
    <div class="mdl-layout__drawer">
        <div class="header">
            <span class="mdl-layout-title">Title Here!</span>
        </div>
        <nav class="mdl-navigation">
            <router-link to="/albums" class="mdl-navigation__link">Albums</router-link>
            <router-link to="/fullscreen" class="mdl-navigation__link">Full Screen</router-link>
            <router-link to="/about" class="mdl-navigation__link">About</router-link>
            <router-link to="/logoff" class="mdl-navigation__link">Log Off</router-link>
        </nav>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name:'Drawer',
    components:{  },
    data() {
        return {
            items: [{
                    name: 'john'
                },
                {
                    name: 'emily'
                },
                {
                    name: 'dean'
                },
                {
                    name: 'mark'
                }
            ]
        }
    }
}
</script>

<style>
.header {
    background-color:#263238; color: #fff; 
    padding:70px 20px 20px 20px; 
}
</style>