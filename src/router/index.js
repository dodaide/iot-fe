import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '../views/DashBoard.vue'
import DataSensor from '../views/DataSensor.vue'
import HistoryAction from '../views/HistoryAction.vue'
import NotFound from '../views/404NotFound.vue'
import MyProfile from '../views/MyProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashBoard
    },
    {
      path: '/data-sensor',
      name: 'Data sensor',
      component: DataSensor
    },
    {
      path: '/history-action',
      name: 'History action',
      component: HistoryAction
    },
    {
      path: '/profile',
      name: 'Profile',
      component: MyProfile
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 Not Found',
      component: NotFound
    },
  ]
})

export default router
