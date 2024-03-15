import { createPinia } from "pinia";
import { useDataStore } from "./modules/useDataStore";
import { createPersistedState  } from 'pinia-plugin-persistedstate'

export const setupStore = (app) => {
    const pinia = createPinia();
    pinia.use(createPersistedState({
        storage: localStorage,
    }));
    app.use(pinia);
}

export {
    useDataStore
}