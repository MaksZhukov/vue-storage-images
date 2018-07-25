<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data () {
    return {
      msg: 'Welcome to Dashboard'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
h1
  text-align: center
</style>
