import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            activeSlide: 0,
            registeredCamera: null
        }
    },
    mutations: {
        changeActiveSlide(state, value) {
            state.activeSlide = value
        },
        changeRegisteredCamera(state, value) {
            state.registeredCamera = value
        }
    }
})

export default store;