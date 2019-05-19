<style>
    .MyFooter {
        background-color: rgba(255,255,255,0.4) !important; 
        color: #fff;
    }
</style>

<template>
    <v-footer v-if="isShow" :fixed="true" app class="MyFooter">
         <span style="padding-left:5px">{{getDebugMessage}}</span>
         <v-spacer></v-spacer>
         <span>Version {{$store.state.version}}</span>
    </v-footer>
</template>

<script>
    export default {
        computed: {
            isShow: function() {
                console.log('footer.isShow:', this.$store.state.footer.isShow);
                return this.$store.state.footer.isShow;
            },
            getDebugMessage: function () {
                return this.$store.state.DebugMessage;
            }
        }
    };
</script>