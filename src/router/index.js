import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/login/login'
import Home from '@/components/common/home/home'
import Infobasic from '@/components/page/Infobasic'
import Tactics from '@/components/page/Tactics'
import Monitor from '@/components/page/Monitor'
import InfoResource from '@/components/page/InfoResource'
import InfoResourceDetail from '@/components/page/InfoResource/InfoResourceDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path: '/login', name: 'login', component: Login},
    {path: '/home', component: Home, children: [
      {path: '/', name: 'infobasic', component: Infobasic},
      {path: '/infobasic', component: Infobasic},
      {path: '/tactics', name: 'tactics', component: Tactics},
      {path: '/monitor', name: 'monitor', component: Monitor},
      {path: '/infoResource', name: 'infoResource', component: InfoResource},
      {path: '/infoResourceDetail', name: 'infoResourceDetail', component: InfoResourceDetail}
    ]},
  ]
})
