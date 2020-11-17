import Vue from 'vue'
import VueRouter from 'vue-router'
import TwigsHome from '../components/TwigsHome'
import Login from '../components/user/Login'
import NewBudget from '../components/budget/NewBudget'
import EditBudget from '../components/budget/EditBudget'
import BudgetDetails from '../components/budget/BudgetDetails'
import BudgetList from '../components/budget/BudgetList'
import NewCategory from '../components/category/NewCategory'
import EditCategory from '../components/category/EditCategory'
import CategoryDetails from '../components/category/CategoryDetails'
import NewTransaction from '../components/transaction/NewTransaction'
import EditTransaction from '../components/transaction/EditTransaction'
import TransactionDetails from '../components/transaction/TransactionDetails'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: TwigsHome,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/budgets',
    name: 'budgets',
    component: BudgetList,
  },
  {
    path: '/budgets/new',
    name: 'newBudget',
    component: NewBudget,
  },
  {
    path: '/budgets/:id',
    name: 'budgetDetails',
    component: BudgetDetails,
  },
  {
    path: '/budgets/:id/edit',
    name: 'editBudget',
    component: EditBudget,
  },
  {
    path: '/categories/new',
    name: 'newCategory',
    component: NewCategory,
  },
  {
    path: '/categories/:id',
    name: 'categoryDetails',
    component: CategoryDetails,
  },
  {
    path: '/categories/:id/edit',
    name: 'editCategory',
    component: EditCategory,
  },
  {
    path: '/transactions/new',
    name: 'newTransaction',
    component: NewTransaction,
  },
  {
    path: '/transactions/:id',
    name: 'transactionDetails',
    component: TransactionDetails,
  },
  {
    path: '/transactions/:id/edit',
    name: 'editTransaction',
    component: EditTransaction,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
