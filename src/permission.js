import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if(hasToken) {
    const hasGetUserInfo = store.getters.avatar
    if(!hasGetUserInfo) {
      await store.dispatch('user/getUserInfo')
    }
  }
  if (to.matched.some(res => res.meta.requireAuth)){
    if (hasToken) {
      next()
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next({path:'/404'})
        NProgress.done()
      }
    }
  }
  else 
    next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
