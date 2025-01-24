<template>
  <HeaderBar
    :currentName="_t18('newsDetail')"
    :border_bottom="false"
  ></HeaderBar>
  <div class="container">

    <div class="news-desc">
      <div class="news-desc-title">免责声明：</div>
      <div class="news-desc-content">
        本平台包含第三方内容,我们不为其内容背书.数字资产价格波动剧烈,投资前请做好研究.
        在此处查看完整条款.
      </div>
    </div>

    <div class="news-content" v-html="content"></div>

  </div>
</template>
<script setup>
import { getJPNewsContent } from '@/api/news'

const Route = useRoute()
const content = ref('')

const getNewsContent = async () => {
  getJPNewsContent({ urlRoad: Route.query.urlRoad }).then(res => {
    console.log(res)
    content.value = res.data.content
  })
}

getNewsContent()

</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}
.container {
  padding: 0 15px 15px 15px;
  .news-desc {
    background: var(--ex-backup--background-color);
    border-radius: 10px;
    border: 1px solid var(--ex-border-color11);
    padding: 12px 15px;
    margin-top: 15px;
    &-content {
      font-size: 12px;
      margin-top: 10px;
      line-height: 20px;
    }
  }
  .news-content {
    margin-top: 20px;
    line-height: 20px;
    :deep(img) {
      width: 100%;
    }
  }
}
</style>