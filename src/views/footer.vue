<template>
    <v-footer v-if="isShow" :fixed="true" app>
         {{getDebugMessage}}<v-spacer></v-spacer>
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