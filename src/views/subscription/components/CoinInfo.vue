<template>
  <div class="infoCoin">
    <div class="top">
      <image-load :filePath="data?.logo" class="coinImg" v-if="data?.logo"/>
      <p class="fw-bold">{{ data.showSymbol }}</p>
    </div>
    <div class="bottom">
      <div class="tip1">
        <p>{{ data.type != 1 ? _t18('subscription') + _t18('price') : _t18('Placement-price') }}</p>
        <p class="fw-num">{{ data.price }}</p>
      </div>
      <div class="tip2">
        <p>
          <!-- 发行总量 -->
          {{ _t18('Total_issuance') }}
        </p>

        <p class="fw-num">{{ data.totalAmount }} {{ data.showSymbol }}</p>
      </div>
      <!--      formData.type == 1 配售  0 申购-->
      <!--      formData.type == 1 ? _t18('Placement') :_t18(`Immediate-subscription`)-->
      <div class="tip2" v-if="data.type == 1 ">
        <p>
          <!-- 预估价格 -->
          {{ _t18('Estimated-listing-price') }}
        </p>

        <p class="fw-num">{{ data.estimatedPrice }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {_t18} from '@/utils/public'

const props = defineProps({
  data: {
    type: Object
  }
})
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-home-list-ftcolor2);
}

.infoCoin {
  background: var(--ex-financial-card-bg-color);
  border-radius: 8px;

  .top {
    padding: 10px 17px;
    display: flex;
    align-items: center;
    color: var(--ex-default-font-color);
    background: #252a4d;
    border-radius: 8px;

    .coinImg {
      width: 34px;
      height: 34px;
      margin-right: 10px;
    }

    p {
      font-size: 20px;
      color: var(--ex-default-font-color);
    }
  }

  .bottom {
    padding: 15px 15px;
    display: flex;

    .tip1,
    .tip2 {
      flex: 1;

      & > p:first-child {
        font-size: 13px;
        margin-bottom: 10px;
      }

      & > p:last-child {
        font-size: 13px;
        color: var(--ex-default-font-color);
      }
    }
  }
}
</style>
