<template>
	<div v-if="category" class="category-details">
		<div class="header-info">
			<h2>{{ category.title }}</h2>
			<h3>
				Balance: {{ balance.toLocaleString(undefined, {style: 'currency', currency: 'USD'}) }}
			</h3>
			<div class="actions">
				<button @click="addTransaction()">
					<span class="icon-add" /> Add Transaction
				</button>
					<button @click="editCategory()">
						Edit
					</button>
					<button @click="deleteCategory()">
						Delete
					</button>
			</div>
		</div>
		<h3>Transactions</h3>
		<TransactionList :category-id="category.id" />
	</div>
</template>
<script>
import { mapState } from 'vuex'
import TransactionList from '../transaction/TransactionList'

export default {
    name: 'CategoryDetails',
    components: {
        TransactionList,
    },
    computed: {
        ...mapState(['categories', 'currentCategory']),
        category: function(state) {
            if (state.categories.length === 0 || !state.currentCategory) {
                return false
            }
            return state.categories.find((category) => category.id === Number.parseInt(state.currentCategory))
        },
        balance: function(state) {
            if (!state.currentCategory) {
                return 0
            }
            return this.$store.getters.categoryBalance(state.currentCategory) / 100
        },
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            this.$store.dispatch('categoryDetailsViewed', this.$route.params.id)
        },
        addTransaction() {
            this.$store.dispatch('addTransactionClicked')
        },
        editCategory() {
            this.$store.dispatch('editCategoryClicked', this.$route.params.id)
        },
        deleteCategory() {
            this.$store.dispatch('deleteCategoryClicked', this.$route.params.id)
        },
    },
}
</script>
