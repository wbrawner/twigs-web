<template>
	<div>
		<div v-if="!loading" class="add-edit-budget">
			<h2>{{ budget.id ? 'Edit' : 'Add' }} Budget</h2>
			<input v-model="budget.name"
				type="text"
				placeholder="Name"
				title="Name">
			<textarea v-model="budget.description" placeholder="Description" title="Description" />
			<div class="sharing">
				<h3>Sharing</h3>
				<input v-model="user"
					type="test"
					placeholde="User"
					title="User"
					@keyup.enter="addPermission()">
				<ul v-if="budget.users" class="sharing-users">
					<li v-for="userPermission in budget.users" :key="userPermission.user">
						<span v-if="userPermission.user">
							{{ userPermission.user }}
						</span>
						<span v-if="userPermission.permission">
							: {{ userPermission.permission }}
						</span>
					</li>
				</ul>
			</div>
			<button @click="saveBudget()">
				Save Budget
			</button>
		</div>
		<div v-if="loading" class="icon-loading" />
	</div>
</template>
<script>

export default {
    name: 'BudgetForm',
    components: {
    },
    props: {
        budget: {
            default: {},
            type: () => {},
        },
    },
    data: function() {
        return {
            saving: false,
            user: undefined,
        }
    },
    computed: {
        loading: state => state.budget === undefined || state.saving,
    },
    methods: {
        addPermission() {
            const user = this.user
            this.user = undefined
            this.budget.users = this.budget.users.filter(u => u.user !== user)
            this.budget.users.push({
                user: user,
                permission: 2,
            })
        },
        saveBudget() {
            this.saving = true
            this.$store.dispatch('budgetFormSaveClicked', this.budget)
        },
    },
}
</script>
<style scoped>
.add-edit-budget > * {
    display: block;
    width: 100%;
    max-width: 500px;
}
.radio-container {
    display: flex;
    align-items: center;
}

.radio-container label {
    margin-right: 1em;
}
.icon-loading {
    margin-top: 16px;
}
</style>
