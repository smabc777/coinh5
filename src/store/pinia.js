import {createPinia} from 'pinia';
//状态管理持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
//注入插件
pinia.use(piniaPluginPersistedstate)

export default pinia;
