<template>
  <div class="assetDetails">
    <div v-for="(item, index) in assetDetails" :key="index">
      <div class="title" v-if="item.icon == 'usdt'">
        <!-- 资产明细 -->
        <div class="left fw-bold">{{ _t18('asset_detail', ['ebc', 'mimic']) }}</div>
      </div>
      <div class="details">
        <div class="top">
          <svg-load v-if="item.title == 'USDT'" :name="item.icon" class="currencyIcon"></svg-load>
          <image-load :filePath="item?.loge || ''" v-else />
          <span class="fw-num">{{ item.title }}</span>
        </div>
        <div class="bottom">
          <div>
            <!-- 可用 -->
            <p class="til">{{ _t18('asset_available') }}</p>
            <p class="num fw-num">{{ amountFormat(item.keyong) }}</p>
          </div>
          <div>
            <!-- 占用 冻结-->
            <!--            <p class="til" v-if="['rxce'].includes(_getConfig('_APP_ENV'))">-->
            <!--              {{ _t18('asset_cold') }}-->
            <!--            </p>-->
            <p class="til">{{ _t18('asset_occupation', ['bitmake', 'moonex', 'ebc']) }}</p>
            <p class="num fw-num">
              {{ amountFormat(item.zhanyong, 5) }}
            </p>
          </div>
          <div>
            <!-- 折合 -->
            <p class="til" v-if="['moonex'].includes(_getConfig('_APP_ENV'))">
              {{ _t18('asset_equivalent', ['moonex']) }}
            </p>
            <p class="til" v-else>{{ _t18('asset_equivalent', ['bitmake', 'ebc']) }}(USDT)</p>
            <p class="num fw-num">
              {{ amountFormat(item.zhehe) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _hide, _t18, _numberWithCommas, _getConfig } from '@/utils/public.js'
import { priceFormat } from '@/utils/decimal.js'

const props = defineProps({
  assetDetails: {
    type: Object
  },
  showNum: {
    type: Boolean
  }
})

/**
 * 金额格式化
 * @param {*} amount
 * @param {*} hide
 * @param {*} decimal
 */
const amountFormat = (amount, decimal = 0) => {
  let tempVal = priceFormat(amount, decimal)
  if (props.showNum) {
    tempVal = _numberWithCommas(tempVal)
  } else {
    tempVal = _hide(tempVal)
  }
  return tempVal
}
console.log(props.assetDetails, 'assetDetails')
</script>

<style lang="scss" scoped>
.assetDetails {
  background: var(--ex-financial-card-bg-color);
  padding: 24px 16px 100px;
  flex-grow: 1;

  &>div {
    .title {
      display: flex;
      justify-content: center;

      .left {
        color: var(--ex-font-color6);
        font-size: 18px;
        font-weight: 400;
      }
    }

    .details {
      margin-top: 16px;
      border-radius: 8px;
      border: 1px solid var(--ex--backup-background-color-2);
      padding: 20px 18px;

      .top {
        line-height: normal;
        display: flex;
        align-items: center;

        img {
          border-radius: 100%;
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }

        .currencyIcon {
          font-size: 20px;
          margin-right: 5px;
        }

        span {
          font-size: 16px;
          color: var(--ex-font-color6);
        }
      }

      .bottom {
        display: flex;

        &>div {
          flex: 1;
          word-break: break-all;
          text-align: center;
          margin: 0 5px;

          .til {
            padding: 20px 0;
            font-size: 13px;
            color: var(--ex-assets--font-card-color);
            white-space: nowrap;

          }

          .num {
            color: var(--ex-font-color6);
            font-size: 14px;
            font-weight: 400;
          }

          &:first-child {
            text-align: start;
          }

          &:last-child {
            text-align: end;
          }
        }
      }
    }
  }
}
</style>
