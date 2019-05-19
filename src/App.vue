<template>
  <v-app dark>
    <Appbar/>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Appbar from './components/appbar.vue'

export default {
  name: 'App',
  data () {
    return {
      //
    }
  },
  components: {
    Appbar
  }
}
</script>
