import './assets/main.css';

import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import { initializeApp } from "firebase/app";
import firebaseConfig from './config/firebase';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faBarcode,
    faCartShopping, faCheck,
    faChevronDown,
    faChevronUp,
    faUser,
    faUtensils, faXmark
} from '@fortawesome/free-solid-svg-icons';

initializeApp(firebaseConfig);

library.add(faBarcode, faCartShopping, faUtensils, faChevronDown, faChevronUp, faUser, faCheck, faXmark);

const app = createApp(App);

app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
