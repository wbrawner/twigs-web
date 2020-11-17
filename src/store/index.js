/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

const API_URL = process.env.VUE_APP_API_URL;

function authenticatedHeaders(authentication) {
  let authorization;
  if (authentication !== undefined) {
    authorization = authentication
  } else {
    const authCookie = document.cookie.split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.indexOf('authorization') === 0);
    if (authCookie) {
      authorization = authCookie.slice(14)
    }
  }
  const headers = new Headers({
    'Content-Type': 'application/json'
  });
  if (authorization) {
    headers.append('Authorization', authorization);
  }
  return headers;
}

export default new Vuex.Store({
  state: {
    user: undefined,
    budgets: [],
    budgetBalances: {},
    currentBudget: 0,
    categories: [],
    categoryBalances: {},
    currentCategory: 0,
    transactions: [],
    currentTransaction: 0,
  },
  getters: {
    user: (state) => state.user,
    budgets: (state) => state.budgets,
    budget: (state) => state.budgets.find(budget => budget.id === state.currentBudget),
    budgetBalance: (state) => (id) => state.budgetBalances[id],
    categories: (state) => state.categories,
    category: (state) => state.categories.find(category => category.id === state.currentCategory),
    categoryBalance: (state) => (categoryId) => {
      return state.categoryBalances[categoryId] || 0
    },
    categoryRemainingBalance: (state, getters) => (category) => {
      const modifier = category.expense ? -1 : 1
      return category.amount - (getters.categoryBalance(category.id) * modifier)
    },
    transactions: (state) => state.transactions,
    transaction: (state) => state.transactions.find(transaction => transaction.id === state.currentTransaction),
  },
  actions: {
    loginClicked() {
      router.push({ name: 'login' })
    },
    loginSubmitClicked({ commit }, credentials) {
      const auth = `Basic ${btoa(credentials.username + ':' + credentials.password)}`.trim();
      get('users/me')
        .then(user => {
          document.cookie = `authorization=${auth}`;
          commit('setUser', user)
          router.push({ name: 'budgets' })
        })
    },
    addBudgetClicked({ commit }) {
      router.push({ name: 'newBudget' })
    },
    budgetListViewed({ commit }) {
      get('budgets')
        .then(budgets => {
          commit('setBudgets', budgets)
          budgets.forEach(budget => {
            get(`budgets/${budget.id}/balance`)
              .then(balance => {
                commit({
                  type: 'setBudgetBalance',
                  ...balance,
                })
              })
          })
        })
    },
    budgetClicked({ commit }, budgetId) {
      router.push({ name: 'budgetDetails', params: { id: budgetId } })
    },
    editBudgetViewed({ commit, state, getters }, budgetId) {
      commit('setCurrentBudget', budgetId)
      if (budgetId !== undefined && getters.budget === undefined) {
        get(`${API_URL}/budgets/${budgetId}`)
          .then(budgets => {
            commit('setBudgets', [budgets])
          })
      }
    },
    budgetFormSaveClicked({ commit }, budget) {
      let request
      if (budget.id) {
        request = put(`budgets/${budget.id}`, budget)
      } else {
        request = post(`budgets`, budget)
      }
      request.then(budget => {
          commit('addBudget', budget)
          router.push({ name: 'budgetDetails', params: { id: budget.id } })
        })
    },
    budgetDetailsViewed({ commit, state, getters }, budgetId) {
      commit('setCurrentBudget', budgetId)
      if (budgetId !== undefined && getters.budget === undefined) {
        fetch(`${API_URL}/budgets`, { headers: authenticatedHeaders() })
          .then(res => res.json())
          .then(budgets => {
            commit('setBudgets', budgets)
          })
      }
      commit('setCategories', [])
      commit('setTransactions', [])
      commit('setCurrentCategory', undefined)
      fetch(`${API_URL}/categories?budgetIds=${budgetId}`, { headers: authenticatedHeaders() })
        .then(res => res.json())
        .then(categories => {
          commit('setCategories', categories)
          categories.forEach(category => {
            fetch(`${API_URL}/categories/${category.id}/balance`, { headers: authenticatedHeaders() })
              .then(res => res.json())
              .then(balance => {
                commit({
                  type: 'setCategoryBalance',
                  ...balance,
                })
              })
          })
        })
      fetch(`${API_URL}/transactions?budgetId=${budgetId}?count=10`, { headers: authenticatedHeaders() })
        .then(res => res.json())
        .then(transactions => commit('setTransactions', transactions))
    },
    editBudgetClicked({ commit }, budgetId) {
      router.push({ name: 'editBudget', params: { id: budgetId } })
    },
    deleteBudgetClicked({ commit }, budgetId) {
      fetch(`${API_URL}/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: authenticatedHeaders()
      })
        .then(() => {
          commit('deleteBudget', budgetId)
          router.push({ name: 'home' })
        })
    },
    categoryClicked({ commit }, categoryId) {
      router.push({ name: 'categoryDetails', params: { id: categoryId } })
    },
    addCategoryClicked({ commit }) {
      router.push({ name: 'newCategory' })
    },
    editCategoryClicked({ commit }, categoryId) {
      router.push({ name: 'editCategory', params: { id: categoryId } })
    },
    editCategoryViewed({ commit, state, getters }, categoryId) {
      commit('setCurrentCategory', categoryId)
      if (categoryId !== undefined && getters.category === undefined) {
        fetch(`${API_URL}/categories/${categoryId}`, { headers: authenticatedHeaders() })
          .then(res => res.json())
          .then(category => {
            commit('setCategories', [category])
          })
      }
    },
    categoryDetailsViewed({ commit, state }, categoryId) {
      commit('setCurrentCategory', categoryId)
      if (state.categories.length === 0) {
        fetch(`${API_URL}/categories/${categoryId}`, { headers: authenticatedHeaders() })
          .then(res => res.json())
          .then(category => {
            commit('setCategories', [category])
          })
      }
      fetch(`${API_URL}/transactions?categoryId=${categoryId}`, { headers: authenticatedHeaders() })
        .then(res => res.json())
        .then(transactions => commit('setTransactions', transactions))
    },
    categoryFormSaveClicked({ commit }, category) {
      let request
      if (category.id) {
        request = put(`categories/${category.id}`, category)
      } else {
        request = post('categories', category)
      }
      request.then(category => {
          commit('addCategory', category)
          router.push({ name: 'categoryDetails', params: { id: category.id } })
        })
    },
    deleteCategoryClicked({ commit, state }, categoryId) {
      fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: authenticatedHeaders(),
      })
        .then(() => {
          commit('setCurrentCategory', undefined)
          commit('deleteCategory', categoryId)
          router.push({ name: 'budgetDetails', params: { id: state.currentBudget } })
        })
    },
    addTransactionClicked({ commit }) {
      router.push({ name: 'newTransaction' })
    },
    editTransactionViewed({ commit, state, getters }, transactionId) {
      commit('setCurrentTransaction', transactionId)
      if (transactionId !== undefined && getters.transaction === undefined) {
        fetch(`${API_URL}/transactions/${transactionId}`, { headers: authenticatedHeaders() })
          .then(res => res.json())
          .then(transactions => {
            commit('setTransactions', [transactions])
          })
      }
    },
    addEditTransactionBudgetSelected({ commit, state }, budgetId) {
      commit('setCategories', [])
      if (!budgetId) return
      fetch(`${API_URL}/categories?budgetId=${budgetId}`, { headers: authenticatedHeaders() })
        .then(res => res.json())
        .then(categories => {
          commit('setCategories', categories)
        })
    },
    transactionFormSaveClicked({ commit }, transaction) {
      let request
      if (transaction.id) {
        request = put(`transactions/${transaction.id}`, transaction)
      } else {
        request = post('transactions', transaction)
      }
      request.then(res => res.json())
        .then(transaction => {
          commit('addTransaction', transaction)
          router.push({ name: 'transactionDetails', params: { id: transaction.id } })
        })
    },
    transactionClicked({ commit }, transactionId) {
      router.push({ name: 'transactionDetails', params: { id: transactionId } })
    },
    transactionDetailsViewed({ commit, state }, transactionId) {
      commit('setCurrentTransaction', transactionId)

      if (state.transactions.length === 0) {
        fetch(`${API_URL}/transactions/${transactionId}`, { headers: authenticatedHeaders() })
          .then(res => res.json())
          .then(transaction => {
            commit('setTransactions', [transaction])
            if (state.categories.length === 0) {
              fetch(`${API_URL}/categories?budgetId=${transaction.budgetId}`, { headers: authenticatedHeaders() })
                .then(res => res.json())
                .then(categories => {
                  commit('setCategories', categories)
                  categories.forEach(category => {
                    fetch(`${API_URL}/categories/${category.id}/balance`, { headers: authenticatedHeaders() })
                      .then(res => res.json())
                      .then(balance => {
                        commit({
                          type: 'setCategoryBalance',
                          ...balance,
                        })
                      })
                  })
                })
            }
          })
      }
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    addBudget(state, budget) {
      state.budgets = [
        ...state.budgets.filter(b => b.id !== budget.id),
        budget,
      ]
    },
    setCurrentBudget(state, budgetId) {
      state.currentBudget = Number.parseInt(budgetId)
    },
    setBudgetBalance(state, data) {
      state.budgetBalances = {
        ...state.budgetBalances,
        [data.budgetId]: data.balance,
      }
    },
    setBudgets(state, budgets) {
      state.budgets = budgets
    },
    deleteBudget(state, budget) {
      state.budgets = [
        ...state.budgets.filter(b => b.id !== budget.id),
      ]
    },
    addCategory(state, category) {
      state.categories = [
        ...state.categories.filter(c => c.id !== category.id),
        category,
      ]
    },
    setCurrentCategory(state, categoryId) {
      state.currentCategory = Number.parseInt(categoryId)
    },
    setCategories(state, data) {
      state.categories = data
    },
    setCategoryBalance(state, data) {
      state.categoryBalances = {
        ...state.categoryBalances,
        [data.id]: data.balance,
      }
    },
    deleteCategory(state, category) {
      state.categories = [
        ...state.categories.filter(c => c.id !== category.id),
      ]
    },
    addTransaction(state, transaction) {
      state.transactions = [
        ...state.transactions.filter(t => t.id !== transaction.id),
        transaction,
      ]
    },
    setTransactions(state, data) {
      state.transactions = data
    },
    setCurrentTransaction(state, transactionId) {
      state.currentTransaction = Number.parseInt(transactionId)
    },
  }
})

function get(path) {
  return fetch(`${API_URL}/${path}`, { headers: authenticatedHeaders() })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw Error(res.statusText)
      }
    })
}

function post(path, body) {
  return fetch(`${API_URL}/${path}`, {
    method: 'POST',
    headers: authenticatedHeaders(),
    body: JSON.stringify(body)
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw Error(res.statusText)
      }
    })
}

function put(path, body) {
  return fetch(`${API_URL}/${path}`, {
    method: 'PUT',
    headers: authenticatedHeaders(),
    body: JSON.stringify(body)
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw Error(res.statusText)
      }
    })
}

function del(path) {
  return fetch(`${API_URL}/${path}`, {
    method: 'DELETE',
    headers: authenticatedHeaders()
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw Error(res.statusText)
      }
    })
}
