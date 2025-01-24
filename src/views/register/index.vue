<template>

  <div class="register">

    <div class="languages">
      <div class="right" @click="_toView('/language-selection')">
        <image-load :filePath="currentLanguage?.imgUrl" class="lang img" />
        <span>{{ currentLanguage.remark }}</span>
      </div>
      <van-icon @click="_toView('/home')" name="cross" size="20" color="var(--ex-default-font-color)" />
    </div>

    <h3 class="login-title fw-bold">{{ _t18('register') }}</h3>


    <van-tabs v-model:active="active" line-width="0" :ellipsis="false" swipeable animated>
      <van-tab v-for="(item, index) in tabList" :key="index" :name="item.id">

        <template #title>
          <!-- <div class="tab-item" :class="{atv:item.id== active}" v-if="!['vitc'].includes(_getConfig('_APP_ENV'))">{{ item.title }}</div> -->
          <div class="tab-item" :class="{ atv: item.id == active }"
            v-if="tabList.filter((item, index) => { return item.show }).length > 1">{{ item.title }}
          </div>
        </template>

        <template #default>
          <!--账号登录-->
          <Account v-show="active == 1"></Account>
          <!--邮箱登录-->
          <Email v-show="active == 2"></Email>
          <!--手机号登录-->
          <Mobile v-show="active == 3"></Mobile>
          <!-- vitc邮箱注册-->
          <Emailvitc v-show="active == 4"></Emailvitc>
        </template>

      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { useMainStore } from '@/store/index'
import { _getConfig, _isRFD, _t18, _toView } from "@/utils/public";
import Account from "./components/Account/index.vue";
import Mobile from "./components/Mobile/index.vue";
import Email from "./components/Email/index.vue";
import Emailvitc from "./components/Email/vitc.vue";

const userStore = useUserStore()
const mainStore = useMainStore()


//多语言
const currentLanguage = computed(() =>
  mainStore.languageList.find((elem) => elem.dictValue == mainStore.language)
)

// 注册列表
const active = ref(null)
console.log('asdas')
const tabList = computed(() => {
  var ordinaryRegisterIsOpen = mainStore.getLoginMethodList?.ordinaryRegisterIsOpen;
  var ordinaryIsOpen = mainStore.getLoginMethodList.ordinaryIsOpen;

  var emailRegisterIsOpen = mainStore.getLoginMethodList?.emailRegisterIsOpen;
  var emailIsOpen = mainStore.getLoginMethodList.emailIsOpen;

  var phoneRegisterIsOpen = mainStore.getLoginMethodList?.phoneRegisterIsOpen;
  var phoneIsOpen = mainStore.getLoginMethodList.phoneIsOpen;


  console.log('账号', ordinaryRegisterIsOpen, ordinaryIsOpen)
  console.log('邮箱', emailRegisterIsOpen, emailIsOpen)
  console.log('手机号', phoneRegisterIsOpen, phoneIsOpen)

  let list = [
    {
      id: 1,
      title: _t18('register_account', ['moonex']),
      type: '1',
      show: mainStore.getLoginMethodList?.ordinaryIsOpen || false,

      // show: ((ordinaryRegisterIsOpen == undefined) ? ordinaryIsOpen : ordinaryRegisterIsOpen) || false,
      componentName: '',
    },
    {
      id: !['vitc'].includes(_getConfig('_APP_ENV')) ? 2 : 4,
      title: _t18('register_email', ['moonex']),
      type: '2',
      show: mainStore.getLoginMethodList?.emailIsOpen || false,

      // show: (emailRegisterIsOpen == undefined ? emailIsOpen : emailRegisterIsOpen) || false,
      componentName: '',
    },
    {
      id: 3,
      title: _t18('register_mobile', ['moonex']),
      type: '3',
      show: mainStore.getLoginMethodList?.phoneIsOpen || false,

      // show: (phoneRegisterIsOpen == undefined ? phoneIsOpen : phoneRegisterIsOpen) || false,
      componentName: '',
    }
  ]

  console.log(list, 'nnnnnnn888888');

  return list.filter(item => item.show)
})

</script>

<style scoped lang="scss">
.register {
  padding: 20px 16px;

  .languages {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {

      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      span {
        font-size: 14px;
        color: var(--ex-font-color8);
      }
    }
  }

  .login-title {
    margin-top: 32px;
    font-size: 32px;
  }

  :deep(.van-tabs) {
    margin-top: 24px;
    overflow: hidden;


    .van-tabs__nav {
      border-radius: 10px;
      padding: 0;
      background: var(--ex-home-tabs-bg-color);
    }

    .tab-item {
      padding: 12px 0;
      width: 100%;
      font-size: 14px;
      color: var(--ex-home-tabs-text-color);

      &.atv {
        font-size: 15px;
        color: var(--ex-home-tabs-text-atv-color);
      }
    }

    .van-tab--active {
      background: var(--ex-home-tabs-bg-atv-color);
      color: var(--ex-home-tabs-text-atv-color);
      border-radius: 10px;
    }


  }
}
</style>
