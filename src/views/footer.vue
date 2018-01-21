<template>
    <v-footer :fixed="true" app>
         {{getDebugMessage}}<v-spacer></v-spacer>
         <span>Version {{$store.state.version}}</span>
    </v-footer>
</template>

<script>
    export default {
        computed: {
            getDebugMessage: function () {
                return this.$store.state.DebugMessage;
            }
        }
    };
</script>