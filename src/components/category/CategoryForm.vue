<template>
	<div>
		<div v-if="!loading" class="add-edit-category">
			<h2>{{ category.id ? 'Edit' : 'Add' }} Category</h2>
			<input v-model="category.title"
				type="text"
				placeholder="Name"
				title="Name">
			<input v-model.number="category.amount"
				type="number"
				placeholder="Amount"
				title="Amount">
			<div class="radio-container">
				<input id="expense"
					v-model="category.expense"
					type="radio"
					:value="true">
				<label for="expense">Expense</label>
				<input id="income"
					v-model="category.expense"
					type="radio"
					:value="false">
				<label for="income">Income</label>
			</div>
			<div class="row">
				<input v-model="category.archived" type="checkbox"/>
				<label>Archived</label>
				</div>
			<select v-model="category.budgetId" @change="updateCategories()">
				<option disabled value>
					Select a budget
				</option>
				<option v-for="budget in budgets" :key="budget.id" :value="budget.id">
					{{ budget.name }}
				</option>
			</select>
			<button @click="saveCategory()">
				Save Category
			</button>
		</div>
		<div v-if="loading" class="icon-loading" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'CategoryForm',
    components: {
    },
    props: {
        category: {
            default: () => {},
            type: Object,
        },
    },
    data: function() {
        return {
            saving: false,
        }
    },
    computed: {
        ...mapGetters(['budgets']),
        loading: state => state.category === undefined || state.saving,
    },
    methods: {
        saveCategory() {
            this.saving = true
            this.$store.dispatch('categoryFormSaveClicked', this.category)
        },
    },
}
</script>
<style scoped>
.add-edit-category > * {
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
