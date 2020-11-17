<template>
  <div>
    <div v-if="!loading" class="add-edit-transaction">
      <h2>{{ transaction.id ? "Edit" : "Add" }} Transaction</h2>
      <input v-model="transaction.title" type="text" placeholder="Name" title="Name" />
      <textarea v-model="transaction.description" placeholder="Description" title="Description" />
      <input v-model.number="transaction.amount" type="number" placeholder="Amount" title="Amount" />
      <!-- <DatetimePicker :value="transaction.date" type="datetime" /> -->
      <div class="radio-container">
        <input id="expense" v-model="transaction.expense" type="radio" :value="true" />
        <label for="expense">Expense</label>
        <input id="income" v-model="transaction.expense" type="radio" :value="false" />
        <label for="income">Income</label> 
      </div>
      <select v-model="transaction.budgetId" @change="updateCategories()">
        <option disabled value>Select a budget</option>
        <option v-for="budget in budgets" :key="budget.id" :value="budget.id">
          {{ budget.name }}
        </option>
      </select>
      <select v-model="transaction.categoryId">
        <option disabled value>Select a category</option>
        <option
          v-for="category in filteredCategories"
          :key="category.id"
          :value="category.id"
        >{{ category.title }}</option>
      </select>
      <button @click="saveTransaction()">Save Transaction</button>
    </div>
    <div v-if="loading" class="icon-loading" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "TransactionForm",
  components: {},
  props: {
    transaction: {
      default: () => {},
      type: Object
    }
  },
  data: function() {
    return {
      saving: false
    };
  },
  computed: {
    ...mapGetters(["budgets"]),
    filteredCategories: function(state) {
      return this.$store.getters.categories.filter(function(category) {
        return category.budgetId === state.transaction.budgetId && category.expense === state.transaction.expense;
      });
    },
    loading: state => state.transaction === undefined || state.saving
  },
  mounted() {
    this.updateCategories();
  },
  methods: {
    updateCategories() {
      if (!this.transaction) return;
      this.$store.dispatch(
        "addEditTransactionBudgetSelected",
        this.transaction.budgetId
      );
    },
    saveTransaction() {
      this.saving = true;
      this.$store.dispatch("transactionFormSaveClicked", this.transaction);
    }
  }
};
</script>
<style scoped>
.add-edit-transaction > * {
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
