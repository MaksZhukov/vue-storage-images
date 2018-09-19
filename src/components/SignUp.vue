<template>
  <div class="signup">
    <div class="row">
      <form class="col s12" @submit.prevent="signUp({mail,pass})">
        <div class="row">
          <div class="col s12">
            <div class="input-field">
              <input id="email" type="email" class="validate" required v-model="mail">
              <label for="email">Email</label>
            </div>
            <div class="input-field">
              <input id="pass" type="password" class="validate" required v-model="pass" @input="inputPass()">
              <label for="pass">Password</label>
            </div>
            <div class="input-field">
              <input id="repass" type="password" class="validate" required pattern="input">
              <label for="repass">Repeat password</label>
            </div>
            <div class="row">
              <div class="input-field col">
                <button class="btn pulse" type="submit">Sign Up</button>
              </div>
              <div class="input-field col">
                <button class="btn red pulse" type="button" @click="signInWithGoogle()">Sign Up with Google</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapActions, mapState } from "vuex";

export default {
  name: "SignUp",
  data: () => {
    return {
      mail: "",
      pass: "",
      repassInput: null
    };
  },
  mounted() {
    this.repassInput = document.getElementById("repass");
  },
  methods: {
    ...mapActions("userModule", ["signUp","signInWithGoogle"]),
    inputPass() {
      this.repassInput.pattern = this.pass;
    }
  }
};
</script>


<style lang="sass" scoped>
.signup
	max-width: 600px
	width: 100%
	margin: auto
</style>
