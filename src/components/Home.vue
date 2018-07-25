<template>
  <div class="Welcome">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to vue storage project'
    }
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
h1
  text-align: center
</style>
