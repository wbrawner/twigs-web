<template>
	<TransactionForm :transaction="transaction" />
</template>
<script>
import TransactionForm from './TransactionForm'

export default {
    name: 'NewTransaction',
    components: {
        TransactionForm,
    },
    data: function() {
        return {
            transaction: {
                date: new Date(),
                expense: true,
                budgetId: this.$store.state.currentBudget,
                categoryId: this.$store.state.currentCategory,
            },
        }
    },
}
</script>
