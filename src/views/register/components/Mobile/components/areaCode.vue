<template>

  <van-popup
      v-model:show="areaCodeShow"
      round
      position="bottom"
      teleport="#app"
      :style="{ height: '70%', overflow: 'hidden' }"
  >
    <div class="areaCode">
      <div class="top">
        <span class="title">{{ _t18('areacode') }}</span>
        <van-icon class="right" @click="areaCodeClose" name="cross" size="20" color="var(--ex-default-font-color)"/>
      </div>

      <div class="button">
        <van-search
            v-model="keywords"
            class="search"
            round
            :placeholder="_t18('enter_search_keywords')"
            @update:model-value="onUpdate"
        />
      </div>

      <div  class="content">
        <div v-for="(item, index) in areaList" :key="index">
          <div v-if="item.list.length" class="item">
            <div class="title">{{ item.letter }}</div>
            <div
                v-for="(items, indexs) in item.list"
                :key="indexs"
                @click="setAreaCode(items.phoneCode)"
            >
              <p class="left">{{ current == 'zh' ? items.chineseName : items.englishName }}</p>
              <p class="right">+{{ items.phoneCode }}</p>
            </div>
          </div>
        </div>
      </div>
      <Nodata v-if="!areaList.length"></Nodata>
    </div>

  </van-popup>

</template>

<script setup>
import {_t18, _toView} from '@/utils/public'
import {getAreaCode} from '@/api/user'
import {storageDict} from '@/config/dict'
import {ref} from 'vue'


const RefAreaCode = ref(null)
// 弹窗show
const areaCodeShow = inject('areaCodeShow')
// 关闭弹窗
const areaCodeClose = inject('areaCodeClose')
// 设置区号
const setAreaCode = inject('setAreaCode')

const current = ref(localStorage.getItem(storageDict.LANGUAGE))
const keywords = ref('')

// 区号列表
let originAreaList = []
const areaList = ref([])
// 获取区号
const codeList = () => {
  getAreaCode().then((res) => {
    if (res?.code == 200) {
      let arr = res.data.map((item) => {
        item.list = item.data
        return item
      })
      areaList.value = arr
      originAreaList = JSON.parse(JSON.stringify(arr))
      console.log()
    }
  })
}
codeList()


const onUpdate = (val) => {
  areaList.value = originAreaList
      .filter((item) => {
        item.list = item.data.filter((item1) => {
          return (
              item1.englishName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
              item1.chineseName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
              item1.phoneCode.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
              item1.countryCode.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        })
        return item
      })
      .filter((item) => item.list.length)
}
</script>

<style lang="scss" scoped>
.areaCode {
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: var(--ex-popup-background-color);

    .title {
      font-size: 18px;
      color: var(--ex-default-font-color);
    }

    .right {
      color: var(--ex-default-font-color);

    }
  }

  .button {
    border-bottom: 1px solid var(--ex-div-bgColor10);
  }


  .content {
    flex: 1;
    overflow-y: auto;
    .item {
      padding: 15px 0;

      .title {
        font-size: 18px;
      }

      div {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
      }

      .left {
        font-size: 14px;
        color: var(--ex-font-color8);
      }

      .right {
        font-size: 14px;
      }
    }
  }
}


</style>
