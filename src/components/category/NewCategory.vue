<template>
	<CategoryForm :category="category" />
</template>
<script>
import CategoryForm from './CategoryForm'

export default {
    name: 'NewCategory',
    components: {
        CategoryForm,
    },
    data: function() {
        return {
            category: {
                expense: true,
                budgetId: this.$store.state.currentBudget,
            },
        }
    },
}
</script>
