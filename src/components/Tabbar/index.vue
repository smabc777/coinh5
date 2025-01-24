<!-- 底部 -->
<script setup>
import {useMainStore} from '@/store/index'
import {_getConfig, _t18, _toView} from '@/utils/public'
import {useRouter} from 'vue-router'
import {computed} from 'vue'
import {useUserStore} from '@/store/user'
const userStore = useUserStore()

const router = useRouter()

const mainStore = useMainStore()
let currentTab = ref({})

const getTabbarList = computed(() => {
  return userStore.isSimulate?mainStore.getTabbarList.filter((elem) => elem.isOpen&&['首页', '交易','资产'].includes(elem.name)):mainStore.getTabbarList.filter((elem) => elem.isOpen)
})

watch(
    router.currentRoute,
    (newVal) => {
      // currentTab.value = tabbarList.find((elem) => elem.pathName == newVal.name)

      currentTab.value = getTabbarList.value.find((elem) => elem.key.toLowerCase() == newVal.name.toLowerCase())
    },
    {immediate: true}
)
</script>

<template>
  <div class="tab-bar-box" v-if="currentTab.key !== 'trade'">
    <div class="tab-bar">
      <template v-for="item in getTabbarList" :key="item.key">
        <div class="item" @click="_toView(item.linkUrl)">
          <div class="itemTop">
            <image-load
                :lazy="false"
                :filePath="(currentTab.key != item.key?item.imgUrl:item.checkedImgUrl)"
                class="tabbarImg"
            />
          </div>
          <div :class="{ name: true, active: currentTab.key == item.key }" class="text-ellipsis2">
            <span v-if="['gridai'].includes(_getConfig('_APP_ENV')) && item.linkUrl == '/quote'">
               {{ item.name  }}
            </span>
            <span v-else>
            {{ _t18(item.key)  }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar-box {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: 10px;
  position: fixed;
  z-index: 9;
  background-color: var(--ex-home-tabbar-background-color);
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: var(--ex-max-width);
  border-top: 1px solid var(--ex-home-tabbar-border);

  .tab-bar {
    background-color: var(--ex-bgColor);
    display: flex;
    align-items: center;
    justify-content: center;

    .item {
      min-height: 70px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;
      .icon {
        font-size: 20px;
      }

      .name {
        display: flex;
        align-items: flex-start;
        font-size: 12px;
        text-align: center;
        color: var(--ex-passive-font-color);

        &.active {
          //color: var(--ex-active-font-color);
        }
        span{
          word-break: break-word;
        }
      }

      .itemTop {
        padding: 15px 0 5px;
      }
    }
  }
}

.tabbarImg {
  width: 20px;
  height: 20px;
}
</style>
