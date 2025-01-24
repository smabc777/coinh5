<!-- Defi挖矿 -->
<template>
  <div class="follow">
    <HeaderBar :currentName="_t18('AI GPT')" :border_bottom="false"></HeaderBar>
    <div class="followItemBox">
      <div class="followItemBoxImg">
        <van-image
          round
          width="3rem"
          height="3rem"
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <span>
        We use AI GPT for technical analysis, advanced sentiment analysis analyzing recent financial
        statements and studying recent news headlines to select a portfolio of 10-12 stocks. The
        portfolio has gained 60.2% since its inception.
      </span>
      <p class="cardTitle">Investment Information</p>
      <div class="followItemView">
        <div class="followItemViewText">
          <p>The Annual Average</p>
          <p>48%</p>
        </div>
        <div class="followItemViewText">
          <p>Last Year</p>
          <p>48%</p>
        </div>
        <div class="followItemViewText">
          <p>Profit Probability</p>
          <p>48%</p>
        </div>
      </div>
    </div>
    <div class="followItemContert">
      <p class="cardTitle">Investment Information</p>
      <FundCard></FundCard>
    </div>
    <p class="cardTitle">Where do we get these stocks from?</p>
    <div class="followItemContertText">
      After running the above analysis, AI GPT scores each stock on a scale of 1-100. Then invest in
      the top 10-12 stocks and hold them for about two weeks. After two weeks, rerun the analysis
      and start the process again.
    </div>

    <van-button type="info" color="#613AF1" block class="followButton"
      >Follow the investment</van-button
    >
  </div>
</template>
<script setup>
import FundCard from './components/FinCard.vue'
</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;
}

.followItemBox,
.followItemContert,
.followItemContertText {
  width: calc(100% - 20px);
  padding-bottom: 10px;
  border: 1px solid #252a4d;
  background-color: #252a4d;
  border-radius: 15px;
  margin: 80px auto;
  position: relative;
  height: auto;
  margin-bottom: 15px;
}

.followItemContertText {
  color: #b9c1d9;
  font-size: 14px;
  margin: 5px auto;
  background-color: transparent;
  text-align: center;
  border: 0;
}

.followItemContert {
  margin-top: 5px;
}

.followItemBox span:nth-child(2) {
  color: #b9c1d9;
  margin-top: 1.8rem;
  font-size: 14px;
  display: block;
  text-align: center;
}

.followItemBoxImg {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cardTitle {
  margin: 10px auto;
  display: block;
  text-indent: 2em;
  height: 18px;
  font-size: 16px;
}

.followItemView {
  height: 100px;
  width: calc(100% - 30px);
  background-color: black;
  margin: 10px auto;
  border-radius: 15px;
  display: flex;
  justify-content: space-around;
}

.followItemViewText {
  width: calc(90% / 3);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.followItemViewText P {
  display: block;
  font-size: 14px;
  text-align: center;
}

.followItemViewText P:nth-child(1) {
  color: #b9c1d9;
}

.followItemViewText P:nth-child(2) {
  color: #25a750;
}

.followButton {
  width: 96%;
  margin: 10px auto;
  font-size: 18px;
  height: 54px;
  border-radius: 10px;
}
</style>
