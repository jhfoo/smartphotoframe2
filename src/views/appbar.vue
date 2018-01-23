<style>

</style>

<template>
    <v-toolbar v-if="isShow" fixed app :clipped-left="clipped">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-btn icon @click.stop="miniVariant = !miniVariant">
            <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-btn icon @click.stop="$store.commit('setLeftDrawer',true)">
            <v-icon>web</v-icon>
        </v-btn>
        <v-btn icon @click.stop="$store.commit('setDebugMessage','Works!')">
            <v-icon>web</v-icon>
        </v-btn>
        <v-btn icon @click.stop="clipped = !clipped">
            <v-icon>web</v-icon>
        </v-btn>
        <v-btn icon @click.stop="fixed = !fixed">
            <v-icon>remove</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-toolbar-title v-text="isShow"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>more_vert</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>
    export default {
        data() {
            return {
                clipped: false,
                drawer: true,
                fixed: false,
                items: [{
                    icon: 'bubble_chart',
                    title: 'Inspire'
                }],
                miniVariant: false,
                title: 'SMARTPhotoFrame 2'
            }
        },
        computed: {
            isShow: function() {
                console.log('appbar.isShow:', this.$store.state.Appbar.isShow);
                return this.$store.state.Appbar.isShow;
            }
        }
    }
</script>