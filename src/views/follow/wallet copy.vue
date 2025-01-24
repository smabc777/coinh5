<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('AI Follow')" :border_bottom="false"></HeaderBar>
  <div class="follow">
       <div class="viewHeader"><p>
        申し込まれた金額
       </p>
       <p>
         0USD 
       </p>
        <div>
          <p><span>昨日の収益</span><span>累計収入</span></p>
          <p><span>1000 USD</span><span>1000 USD</span></p>
        </div>
      </div>
     
       <div class="viewContent"> 
        <TitleBar :content="'時間周期'"></TitleBar>
        <div class="viewBox dayBox">1日</div>
        <TitleBar :content="'投資金額'"></TitleBar>
        <div class="viewBox amountBox">金額を入力してください </div>
          <p><span>利用可能：</span><span> 1321182441323.7128USD </span></p>
          <p><span>資金制限:：</span><span> 500001-1000000USD </span></p>
          <p><span>利用可能：</span><span> 1321182441323.7128USD </span></p>
          <p><span>資金制限:：</span><span>500001-1000000USD</span></p>
      </div>
       <button> 作成する </button>
  </div>
</template>
<script>
import TitleBar from '@/components/common/TitleBar/index.vue'
export default {
  components: {
    TitleBar
  }
}

</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;
    >button{
      background:rgba(97, 58, 241, 1);
      border-radius: 10px;
      height: 60px;
      width:90%;
      display: block;
      margin: 40px auto;
      margin-bottom:20px;
    }
  > div {
    width: 90%;
    margin: 0 auto;
    background: rgba(22, 26, 51, 1);
    border-radius:15px;
  }
  .viewHeader{
    height: 250px;
    display: flex;
    font-size: 16px;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    >p:nth-child(1){
      color: rgba(185, 193, 217, 1);
    }
    >div{
      background: rgba(14, 19, 39, 1);
      border-radius:15px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height:100px;
      width: 90%;
      margin: 0 auto;
      p{
        font-size: 14px;
        display: flex;
        justify-content: space-around;
        color: rgba(37, 167, 80, 1);
      }
      >p:nth-child(1){
        color: rgba(185, 193, 217, 1);
      }
    }
  }
  .viewContent{
    margin-top: 50px;

    padding-top: 10px;
    padding-bottom: 20px;
    .viewBox{
      background:rgba(37, 42, 77, 1);
      width:90%;
      height:46px;margin:0 auto;border-radius: 10px;
      font-size: 16px;
      line-height:46px;
      padding-left:20px;
    }
    .amountBox{
      color: rgba(185, 193, 217, 1);
    }
    p{
      display: block;
      height: 20px;
      width:90%;
      font-size:15px;
      margin:15px  auto;
      display: flex;
      justify-content: space-between;
    }
  }


}

</style>
