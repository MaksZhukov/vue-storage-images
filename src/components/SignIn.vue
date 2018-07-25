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
                        <div class="input-field">
                            <button class="btn pulse">Sign In</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import { mapActions, mapState } from 'vuex'
import { toast } from 'materialize-css'

export default {
	name: 'SignIn',
	data: () => {
		return {
			mail: '',
			pass: ''
		}
	},
	methods: {
		...mapActions('userModule',[
			'signIn'
	]),
	},
	computed: mapState('userModule',[
		'signInResponse'
	]),
	watch: {
		signInResponse: function ({message, status}) {
			if (status !== 'pending'){
				toast(message,3000, status);
				if (status === 'success'){
					this.$router.push('dashboard')
				}
			}
		}
	}
}
</script>

<style lang="sass" scoped>
.signin
	max-width: 600px
	width: 100%
	margin: auto
</style>
