<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('AI Follow')" :border_bottom="false"></HeaderBar>
  <div class="follow">
      <div class="butHeader">
        <button :class="[ { 'active': currentButtonIndex === 0 }]" @click="changeButtonColor(0)" >进行中</button>
        <button :class="[ { 'active': currentButtonIndex === 1 }]" @click="changeButtonColor(1)" >已完成</button>
      </div>
          <div class="viewContent">
              <div> 
                  <van-image round width="1.5rem" height="1.5rem" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                  <p>
                    <span>
                        TradeBot
                    </span>
                    <span>
                      ロボットID：AI-20
                    </span>
                  </p>
              </div>
              <div class="viewBox">
                  <p><span>注文番号</span><span>20240526163534539723</span></p>
                  <p><span>買い価格</span><span>111USD</span></p>
                  <p><span>本日の収益</span><span>0.557488USD  </span></p>
                  <p><span>累計収益</span><span>0.557488USD  </span></p>
                  <p><span>サイクル</span><span></span></p>
                  <p><span>稼働時間</span><span> 0日 5時間 55: 11 </span></p>
                  <p><span>終了時刻</span><span>2024-05-27 12:35:35  </span></p>
              </div>
              <button> 利益詳細 </button>
         </div>
         <p>もっとない</p>
  </div>
</template>
<script setup>
   const currentButtonIndex = ref(0); // 初始化当前激活的按钮索引为0
   function changeButtonColor(index) {
      currentButtonIndex.value = index; // 更新当前激活的按钮索引
   }
</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;
  .butHeader{
    background: rgba(22, 26, 51, 1);
    height:50px;
    width:70%;
    border-radius:12px;
    margin: 30px auto;
    >button{
      height:100%;
      width: 50%;
      border-radius: inherit;
      background: inherit;
      font-size: 18px;
      color: rgba(122, 122, 122, 1);
    }
    .active {
      background-color: rgba(37, 42, 77, 1);
      color:white;
      
    }
  }

   .viewContent{
    background-color:rgba(22, 26, 51, 1);
    margin: 20px auto;
    width:90%;
    border-radius:15px;
    min-height: 300px;
    padding: 20px  10px 10px 10px;
    >div:nth-child(1){
      display: flex;

      >p:nth-child(1){
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left:20px;
      }
    }
    .viewBox{
      display: flex;
      flex-direction: column;
      >p{
        display: flex;
        justify-content: space-between;
        margin-top:15px;
      }

      >p>span:nth-child(1){
        color:rgba(185, 193, 217, 1);
        font-size:14px;
      }
      >p>span:nth-child(2){
        color:white;
        font-size:15px;
      }
    }
    >button{
      background: inherit;
      border:1px solid white;
      border-radius: 20px;
      height: 50px;
      width:70%;
      display: block;
      margin: 40px auto;
      margin-bottom:20px;
    }
  }
  >p:last-child{
    text-align: center;
    font-size: 20px;
  }
}
</style>