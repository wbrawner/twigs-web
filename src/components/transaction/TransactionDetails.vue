<template>
	<div v-if="transaction" class="transaction-details">
		<h2>{{ transaction.title }}</h2>
		<h3
			:class="transaction.expense ? 'danger' : 'good'">
			{{ (transaction.amount / 100).toLocaleString(undefined, {style: 'currency', currency: 'USD'}) }} {{ transaction.expense ? 'Expense' : 'Income' }}
		</h3>
		<p class="transaction-info date">
			{{ new Date(transaction.date).toLocaleDateString() }}
		</p>
		<p class="transaction-info description">
			{{ transaction.description }}
		</p>
		<p v-if="category" class="transaction-info category">
			Category: {{ category.title }}
		</p>
		<p v-if="budget" class="transaction-info budget">
			Budget: {{ budget.name }}
		</p>
		<p class="transaction-info registered-by">
			Registered By:
			<!-- <UserBubble
				:user="transaction.createdBy"
				:display-name="transaction.createdBy" /> -->
			{{ new Date(transaction.createdDate).toLocaleDateString() }}
		</p>
		<p v-if="transaction.updatedBy" class="transaction-info updated-by">
			Updated By:
			<!-- <UserBubble
				:user="transaction.updatedBy"
				:display-name="transaction.updatedBy" /> -->
			{{ new Date(transaction.updatedDate).toLocaleDateString() }}
		</p>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'TransactionDetails',
    components: {
    },
    computed: {
        ...mapGetters(['transaction']),
        category: function() {
            const transaction = this.$store.getters.transaction
            if (!transaction || !transaction.categoryId) {
                return undefined
            }
            return this.$store.getters.categories.find(category => category.id === transaction.categoryId)
        },
        budget: function() {
            const transaction = this.$store.getters.transaction
            if (!transaction || !transaction.budgetId) {
                return undefined
            }
            return this.$store.getters.budgets.find(budget => budget.id === transaction.budgetId)
        },
    },
    mounted() {
        this.load()
    },
    methods: {
        load() {
            this.$store.dispatch('transactionDetailsViewed', this.$route.params.id)
        },
    },
}
</script>
