<template>
  <ul>
    <li @click="newBudget()">New Budget</li>
    <li v-for="budget in budgets" :key="budget.id">
      <router-link :to="{ name: 'budgetDetails', params: { id: budget.id } }">{{ budget.name }}</router-link>
    </li>
  </ul>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "BudgetList",
  components: {
  },
  computed: {
    ...mapGetters(["budgets"])
  },
  mounted() {
    this.load();
  },
  methods: {
    load: function() {
      this.$store.dispatch("budgetListViewed");
    },
    newBudget: function() {
      this.$store.dispatch("addBudgetClicked");
    }
  }
};
</script>
