<template>
	<BudgetForm :budget="budget" />
</template>
<script>
import BudgetForm from './BudgetForm'

export default {
    name: 'NewBudget',
    components: {
        BudgetForm,
    },
    data: function() {
        return {
            budget: {
                users: [],
            },
        }
    },
}
</script>
