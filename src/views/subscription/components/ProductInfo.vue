<template>
  <div>
    <p class="title fw-bold">
      <!-- 产品详情 -->
      {{ _t18('product_details') }}
    </p>
    <div class="info">
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Total_issuance') }}</div>
        <div class="infoData_tip_txt">{{ data.totalAmount }}</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Toke_ type') }}</div>
        <div class="infoData_tip_txt">ERC-20</div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_placement_price') }}</div>
        <div class="infoData_tip_txt">{{ data.price }}</div>
      </div>
<!--      <div class="infoData_tip">-->
<!--        <div class="infoData_tip_tit">{{ _t18('Private_Placement_Volume') }}</div>-->
<!--        <div class="infoData_tip_txt">{{ data.raisingAmount }}</div>-->
<!--      </div>-->
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_placement') }}({{ _t18('day') }})</div>
        <div class="infoData_tip_txt">
          {{
            (new Date(data.endTime).getTime() - new Date(data.beginTime).getTime()) /
            (60 * 60 * 24 * 1000)
          }}
        </div>
      </div>
      <div class="infoData_tip">
        <div class="infoData_tip_tit">{{ _t18('Private_Placement_Date') }}</div>
        <div class="infoData_tip_txt">{{ _timeFormat(data.beginTimes, 'MM/DD/YYYY', true) }}</div>
      </div>
      <div class="infoData_tip" @click="getWhitePaper(data)">
        <div class="infoData_tip_tit sidebar_paper ">{{ _t18('sidebar_paper') }}</div>
        <div class="infoData_tip_txt">
          <van-icon name="arrow" size="20" :color="'var(--ex-default-font-color)'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {_timeFormat, _toView} from '@/utils/public'
import {_t18} from '@/utils/public'
import {useMainStore} from "@/store";

const mainStore = useMainStore()

const props = defineProps({
  data: {
    type: Object
  }
})

//获取白皮书URL
const getWhitePaper = async (data) => {
  if (data?.url) {
    window.open(data?.url)
  }

}


</script>

<style lang="scss" scoped>
* {
  // color: var(--ex-home-list-ftcolor2);
}

.title {
  font-size: 16px;
  color: var(--ex-default-font-color);
}

.info {
  margin-top: 20px;
  border-radius: 5px;
  background: var(--ex-financial-card-bg-color);
  padding: 0 14px 20px;
  box-sizing: border-box;

  .infoData_tip {
    padding: 20px 0 0;
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    :nth-child(1) {
      color: var(--ex-home-list-ftcolor2);
    }

    :nth-child(2) {
      color: var(--ex-default-font-color);
    }

    .sidebar_paper {
      color: var(--ex-default-font-color);
    }
  }
}
</style>
