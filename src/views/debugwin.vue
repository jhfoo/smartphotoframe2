<style>
    .DebugBlock {
        position: absolute;
        left: 20px;
        bottom: 50px;
        width: 40%;
        height: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #ccc;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>

<template>
    <div v-if="isShow" class="DebugBlock">
        <div v-for="msg in DebugMessages" v-bind:key="msg.id" style="white-space:nowrap; overflow: hidden">{{msg.msg}}</div>
    </div>
</template>

<script>
    export default {
        name: 'DebugWin',
        components: {},
        mounted() {},
        data() {
            return {}
        },
        computed: {
            DebugMessages() {
                return this.$store.state.debug.messages;
            },
            isShow() {
                return this.$store.state.debug.isShow;
            }
        },
        methods: {}
    }
</script>