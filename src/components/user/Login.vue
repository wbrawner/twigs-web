<template>
	<div>
		<div v-if="!loading" class="login">
			<h2>Login</h2>
			<input v-model="username"
				type="text"
				placeholder="Username or Email"
				title="Username or Email">
			<input v-model="password"
				type="password"
				placeholder="Password"
				title="Password">
			<button @click="login()">
				Login
			</button>
		</div>
		<div v-if="loading" class="icon-loading" />
	</div>
</template>
<script>

export default {
    name: 'Login',
    components: {
    },
    props: [
        'username',
        'password'
    ],
    data: function() {
        return {
            loading: false,
        }
    },
    methods: {
        login() {
            this.loading = true
            this.$store.dispatch('loginSubmitClicked', {
                username: this.username,
                password: this.password
            })
        },
    },
}
</script>
<style scoped>
.login > * {
    display: block;
    width: 100%;
    max-width: 500px;
}
.icon-loading {
    margin-top: 16px;
}
</style>
