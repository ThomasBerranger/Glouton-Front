import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/Home.vue';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
            meta: {requiresAuth: true}
        },
        {
            path: '/scan',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/Scan.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/login',
            component: () => import('@/views/Authentication/Login.vue'),
        },
        {
            path: '/register',
            component: () => import('@/views/Authentication/Register.vue'),
        },
        {
            path: '/account',
            component: () => import('@/views/Authentication/Account.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/product/:id',
            component: () => import('@/views/Product.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/:catchAll(.*)',
            component: () => import('@/views/NotFound.vue'),
        }
    ]
})

router.beforeEach(async (to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                    unsubscribe();
                    resolve(user);
                }, reject);
            });

            if (!user) {
                next('/login');
            } else {
                next();
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la vérification de l'authentification :", error);
            next('/login');
        }
    } else {
        next();
    }

});

export default router
