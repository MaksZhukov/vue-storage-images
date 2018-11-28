<template>
  <div class="signin">
    <div class="row">
      <form class="col s12" @submit.prevent="signIn({mail, pass})">
        <div class="row">
          <div class="col s12">
            <div class="input-field">
              <input id="email" type="email" class="validate" required v-model="mail">
              <label for="email">Email</label>
            </div>
            <div class="input-field">
              <input id="pass" type="password" class="validate" required v-model="pass">
              <label for="pass">Password</label>
            </div>
            <div class="row">
              <div class="input-field col">
                <button type="submit" class="btn pulse">Sign In</button>
              </div>
              <div class="input-field col">
                <button
                  type="button"
                  class="btn pulse red sign-in-with-google"
                  @click="signInWithGoogle()"
                >Sign In With Google</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignIn',
  data: () => {
    return {
      mail: '',
      pass: ''
    }
  },
  methods: {
    ...mapActions('userModule', ['signIn', 'signInWithGoogle'])
  }
}
</script>

<style lang="sass" scoped>
.signin
  max-width: 600px
  width: 100%
  margin: auto
  padding: 10px 0;
</style>
