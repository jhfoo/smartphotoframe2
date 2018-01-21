<template>
    <div>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            Me Button
        </button>

        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
            <i class="material-icons">add</i>
        </button>

        <input id="input" v-model="message" />
        <button id="button" @click="onAdd">Add</button>
    </div>
</template>

<script>
    export default {
        name: 'Drawer',
        components: {},
        data() {
            return {
                message: '',
                items: []
            }
        },
        beforeMount: function () {
            console.log('event: albums.beforeMount');
            if (!window.FbAccount) {
                this.$router.push('login');
            }
        },
        methods: {
        }
    }
</script>