import { createApp } from 'vue'
import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Toaster from "@meforma/vue-toaster";
import App from './App.vue'
import router from './router'


const store = createStore({
    plugins: [createPersistedState()],
    state() {
        return {
            user: {},
            token: "",
            loggedIn: false,
        }
    },
    mutations: {
        logout(state) {
            if(state.loggedIn == true)
            {
                state.loggedIn = false;
                state.user = {};
                state.token = "";
            }
        },

        async science(state) {
            if(state.loggedIn == true)
            {
                const response = await fetch(`${process.env.VUE_APP_ENDPOINT}/backend/dashboard/api/v1/science`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': state.token
                    }
                });

                const result = await response.json();
                if(result.status == "success")
                {
                    state.user = result.user;
                }
                else
                {
                    state.loggedIn = false;
                    state.user = {}
                    state.token = "";
                }
            }
        }
    },
});

createApp(App).use(router).use(store).use(Toaster).use(router).mount('#app');