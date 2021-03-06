import Vue from 'vue'
import Router from 'vue-router'
import Landing from "../layout/landing/Landing";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from "../utils/token";
import store from '../store/index'
import {menu_routers} from "../api/system/menu_api";
import {filterAsyncRouter} from "../store/modules/dynamic";
import Index from "../layout/Index";
import {MessageBox} from 'element-ui'
import Dashboard from "../views/dashboard/Dashboard";

const whiteList = ['/'];
NProgress.configure({showSpinner: false});
Vue.use(Router);
export const constantRoutes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing,
    },
    {
        path: '/home',
        name: 'Home',
        component: Index,
        redirect: '/home/dashboard',
        children: [{
            path: 'dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {title: 'Dashboard', icon: 'fa-tachometer-alt-fast', ref: 'dashboard', affix: true}
        }]
    }, {
        path: '/redirect',
        component: Index,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('../components/Redirect')
            }
        ]
    },
// // 404 page must be placed at the end !!!
    //{path: '*', redirect: '/404', hidden: true}
];

const createRouter = () => new Router({
    // eslint-disable-next-line
    mode: process.env.NODE_ENV === 'development' ? 'history' : 'hash', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
});
const router = createRouter();
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();
    const hasToken = getToken();
    if (hasToken && store) {
        let name = store.getters.name;
        if (!name || name.toString() === '') {
            await store.dispatch('user/user_info').then(() => {
                store.dispatch('updateLoadMenus').then(() => {
                });
                loadMenus(next, to);
                next();
            }).catch(() => {
                store.dispatch('user/logout').then(() => {
                    next(`/?redirect=${to.path}`)
                });
            });
        } else if (!store.getters.loadMenus) {
            store.dispatch('updateLoadMenus').then(() => {
            });
            loadMenus(next, to);
            next();
        } else {
            next();
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            if (store.getters.name.toString() !== '' && !hasToken) {
                MessageBox.confirm('登录过期请重新登录?', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true
                }).then(() => {
                    store.dispatch("user/logout");
                })
            }
            // other pages that do not have dynamic to access are redirected to the login page.
            next(`/?redirect=${to.path}`);
            NProgress.done()
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
});
export const loadMenus = (next, to) => {
    menu_routers().then(res => {
        const asyncRouter = filterAsyncRouter(res.data.message);
        asyncRouter.push({path: '*', redirect: '/404', hidden: true});
        store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
            router.addRoutes(asyncRouter);
            store.dispatch('updateTags', true).then(() => {
                next({...to, replace: true});
            })// 动态添加可访问路由表

        })
    })
};

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher // reset router
}

export default router
