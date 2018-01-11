<template>
    <div class="mdl-layout__drawer">
        <div class="header">
            <span class="mdl-layout-title">Title Here!</span>
        </div>
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="">Albums</a>
            <a class="mdl-navigation__link" href="">Full Screen</a>
            <a class="mdl-navigation__link" href="">About</a>
            <a class="mdl-navigation__link" href="">Log Out</a>
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