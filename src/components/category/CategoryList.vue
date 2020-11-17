<template>
	<ul>
		<li v-for="category in filteredCategories" :key="category.id">
			<a class="category-summary" @click="view(category.id)">
				<div class="category-info">
					<p class="category-name">{{ category.title }}</p>
					<p class="category-balance">
						{{ category.expense ? "Remaining" : "Pending" }}:
						{{
							(
								categoryRemainingBalance(category) / 100
							).toLocaleString(undefined, {
								style: "currency",
								currency: "USD"
							})
						}}
					</p>
				</div>
				<ProgressBar
					:max="category.amount"
					:value="Math.abs(categoryBalance(category.id))"
					:invert-colors="!category.expense" />
			</a>
		</li>
	</ul>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import ProgressBar from '../ProgressBar'

export default {
    name: 'CategoryList',
    components: {
        ProgressBar,
    },
    props: {
        budgetId: {
            default: 0,
            type: Number,
        },
        expense: {
            default: true,
            type: Boolean,
        },
    },
    computed: {
        ...mapState(['categories', 'currentCategory']),
        ...mapGetters(['categoryBalance', 'categoryRemainingBalance']),
        filteredCategories: function(state) {
            return state.categories.filter(
                category => category.expense === this.expense && category.archived === false
            )
        },
    },
    methods: {
        view: function(id) {
            this.$store.dispatch('categoryClicked', id)
        },
    },
}
</script>
<style>
.category-summary {
  padding: 0.5em;
  height: 4em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  cursor: pointer;
}

.category-summary * {
  cursor: pointer;
}

.category-summary:hover {
  background: var(--color-background-hover);
}

.category-summary .category-info {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5em;
}
</style>
