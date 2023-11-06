import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            activeSlide: 0
        }
    },
    mutations: {
        changeActiveSlide(state, value) {
            state.activeSlide = value
        }
    }
})

export default store;