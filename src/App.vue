<template>
  <div id="app">
    <header class="page-header  blue-grey">
      <div class="row">
        <div class="col s1">
          <div class="logo">
            <router-link to="/">
              <i class="material-icons large orange-text">image</i>
            </router-link>
          </div>
        </div>
        <div class="col s11 right-align">
          <router-link class="waves-effect waves-teal btn green" v-if="!user" to="/sign-in">Sign in</router-link>
          <router-link class="waves-effect waves-teal btn green" v-if="!user" to="/sign-up">Sign up</router-link>
          <router-link v-if="user" class="user-email card-panel blue-text text-darken-2" to="/dashboard">{{ user.email }}</router-link>
          <button class="waves-effect waves-light btn" v-if="user" v-on:click="logOut">Log out</button>
        </div>
      </div>
    </header>
    <transition name="component-fade" mode="out-in">
      <router-view/>
    </transition>
    <footer class="page-footer  blue-grey">
      <div class="row">
        <div class="col s1">
          <div class="logo">
            <router-link to="/">
              <i class="material-icons large orange-text">image</i>
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import firebase from "firebase";

export default {
  name: "App",
  methods: {
    ...mapMutations("userModule", ["resetUser", "saveUser"]),
    ...mapMutations("imagesModule", ["resetImages"]),
    logOut() {
      this.resetUser();
      this.resetImages();
      this.$router.replace("sign-in");
    }
  },
  computed: mapState("userModule", ["user"]),
  created() {
    if (this.$localStorage.get("user_token") !== null) {
      this.saveUser();
    }
  }
};
</script>

<style lang="sass">

  body,html
    min-height: 100%
    margin: 0
  header,footer
    padding: 20px
    width: 100%
    .logo
      a
        border: none
    .user-email
      padding: 10px
  #app
    display: flex
    align-items: center
    flex-direction: column
    justify-content: space-between
    min-height: 100vh
  #toast-container
    top: 5%!important
    right: 2%!important
  .component-fade
    &-enter-active,&-leave-active
      transition: all .3s ease
    &-enter,&-leave-to
      transform: translateX(10px)
      opacity: .1
  .success
    background-color: #4CAF50!important
  .error
    background-color: #F44336!important
  .warning
    background-color: #ff9800!important
  .responsive-img
    max-height: 100%

</style>
