<template>
  <van-popup
      v-model:show="SharePopupShow"
      round
      safe-area-inset-top
      safe-area-inset-bottom
      teleport="body"
  >
    <div class="share-commission" id="html-canvas">
      <div class="share-img-box">
        <image-load filePath="defi/share.png" class="img"></image-load>
        <div
            class="fw-num"
            :class="[
          'desc',
          _isRFD(
            historicalData.OpeningPrice,
            historicalData.ClosingPrice,
            historicalData.type == 0 ? 'sell' : 'buy'
          )
        ]"
        >
          {{ historicalData.profitAndLossAmount + historicalData.currencyUnit }}
        </div>
      </div>
      <!-- 下载-->
      <svg-load name="download" class="download" @click="downloadImg"></svg-load>

      <!--交易单详情-->
      <div class="transaction-info">
        <!--交易类型-->
        <div>
          <div class="fw-bold">{{ historicalData.TransactionType }}</div>
          <div>{{ historicalData.CurrencyName }}</div>
        </div>

        <!--开仓价-->
        <div>
          <div class="fw-bold">{{ _t18(`average_opening_price`) }}</div>
          <div class="ff-num">{{ historicalData.OpeningPrice }}</div>
        </div>

        <!--收盘价-->
        <div>
          <div class="fw-bold">{{ _t18(`exchange.close`) }}</div>
          <div class="ff-num">{{ historicalData.ClosingPrice }}</div>
        </div>
      </div>

      <!--底部二维码分享-->
      <div class="transaction-qrcode">
        <div class="number-one-logo">
          <div class="logo-one">
            <Logo></Logo>
          </div>
        </div>
        <div class="introduction">
          <div class="info">
            <div class="title fw-bold">{{ _getConfig('_APP_META_TITLE') }}</div>
            <div class="link">{{ historicalData.QrCode }}</div>
          </div>
        </div>
        <div class="qrcode">
          <QRCode :address="historicalData.QrCode"></QRCode>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import {_isRFD, _t18} from "@/utils/public";
import QRCode from "@/components/common/QRCode/index.vue";
import html2canvas from "html2canvas";
import {useToast} from "@/hook/useToast";
import {profitAndloss} from "@/utils/filters";
import PublicPopup from "@/components/Popup/public.vue";

const {_showName} = useToast()

const SharePopupShow = ref(false)
const historicalData = ref({})
// key 秒合约1  u本位3
const setSharePopupShow = (key, data, yieldHisValue) => {
  SharePopupShow.value = true
  if (key == 1) {
    SecondContractShare(data)
  }

  if (key == 3) {
    UstandardShare(data, yieldHisValue)
  }
}
defineExpose({setSharePopupShow})


// 秒合约
const SecondContractShare = (model) => {
  // 盈亏金额
  let amuout = profitAndloss(model.betAmount, model.rewardAmount)

  // 组件赋值
  historicalData.value = {
    profitAndLossAmount: amuout > 0 ? amuout.toString() : amuout, // 盈亏金额
    TransactionType: model.coinSymbol.toUpperCase() + '/' + model.baseSymbol.toUpperCase(), // 交易类型
    CurrencyName: _showName('Close_position'), // 币种名
    OpeningPrice: model.openPrice.toString(), // 开仓价格
    ClosingPrice: model.closePrice.toString(), // 平仓价格
    type: model.type,
    // QrCode: shareLink + sharkCode, // 二维码
    QrCode: location.origin,
    bgType: `1`, //背景类型，此参数当为用户设置， 暂定1 为默认白色
    currencyUnit: model.baseSymbol.toUpperCase()
  }
}

// U合约
const UstandardShare = (model, yieldHisValue) => {
// 做多
  const opneMore = _showName(`going_long`)
// 开孔
  const openNull = _showName(`open_short`)

  // 组件赋值
  historicalData.value = {
    profitAndLossAmount: yieldHisValue > 0 ? yieldHisValue.toString() : yieldHisValue, // 盈亏金额
    TransactionType: model.symbol.toUpperCase() + '/' + 'USDT', // 交易类型
    CurrencyName: model.type ? openNull : opneMore, // 币种名
    OpeningPrice: model.openPrice.toString(), // 开仓价格
    ClosingPrice: model.dealPrice.toString(), // 平仓价格
    type: model.type,
    // QrCode: shareLink + sharkCode, // 二维码
    QrCode: location.origin,
    bgType: `1`, //背景类型，此参数当为用户设置， 暂定1 为默认白色
    currencyUnit: '%' // 盈利单位
  }
}

// 生成并下载
const downloadImg = () => {
  const divDom = document.getElementById('html-canvas')
  html2canvas(divDom, {
    backgroundColor: null,
    useCORS: true
  }).then((canvas) => {
    // 最终生成图片的 url
    let showImg = canvas.toDataURL('image/png')
    let a = document.createElement('a') // 创建a标签
    a.href = showImg
    a.download = `${+new Date()}.png` // 设置图片名称
    a.click()
  })
}
</script>

<style scoped lang="scss">
// 分享弹出层
.share-commission {
  position: relative;
  padding: 20px 15px;
  width: 90vw;

  .download {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
  }

  .share-img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    :deep(.img) {
      width: 180px;
      height: 180px;
    }

    .desc {
      font-size: 20px;
      margin-top: 5px;
    }
  }

  .transaction-info {
    display: flex;
    padding: 0 15px;

    & > div {
      flex: 1;
      text-align: center;

      & > div:first-child {
        font-size: 14px;
        margin: 20px 0 5px;
      }
    }

    & > div:first-child {
      text-align: left;
    }

    & > div:last-child {
      text-align: right;
    }
  }

  .transaction-qrcode {
    padding-top: 20px;
    display: flex;

    .number-one-logo {
      margin-top: 10px;
    }

    .introduction {
      flex: 1;
      margin-left: 10px;

      .info {
        .title {
          font-size: 16px;
          margin: 10px 0;
        }

        .link {
          word-break: break-all;
        }
      }
    }

    .qrcode {
      :deep(.erweima) {
        border: none;
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
