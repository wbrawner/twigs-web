<template>
	<ul>
		<li v-for="transaction in filteredTransactions" :key="transaction.id">
			<a class="transaction" @click="view(transaction.id)">
				<div class="transaction-details">
					<p class="transaction-name">{{ transaction.title }}</p>
					<p class="transaction-date">{{ new Date(transaction.date).toLocaleDateString() }}</p>
				</div>
				<p
					class="transaction-amount"
					:class="transaction.expense ? 'danger' : 'good'">{{ (transaction.amount / 100).toLocaleString(undefined, {style: 'currency', currency: 'USD'}) }}</p>
			</a>
		</li>
	</ul>
</template>
<script>
import { mapState } from 'vuex'

export default {
    name: 'TransactionList',
    components: {},
    props: {
        budgetId: {
            default: 0,
            type: Number,
        },
        categoryId: {
            default: 0,
            type: Number,
        },
        limit: {
            default: 0,
            type: Number,
        },
    },
    computed: {
        ...mapState(['transactions', 'currentTransaction']),
        filteredTransactions: function(state) {
            const transactions = state.transactions.filter(function(transaction) {
                if (state.budgetId) {
                    return transaction.budgetId === state.budgetId
                }
                if (state.categoryId) {
                    return transaction.categoryId === state.categoryId
                }
                return false
            })
            if (this.limit !== 0) {
                return transactions.slice(0, this.limit)
            } else {
                return transactions
            }
        },
    },
    methods: {
        view: function(id) {
            this.$store.dispatch('transactionClicked', id)
        },
    },
}
</script>
<style>
.transaction {
  padding: 0.5em;
  height: 4em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.transaction * {
  cursor: pointer;
}

.transaction:hover {
  background: var(--color-background-hover);
}

.transaction-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
