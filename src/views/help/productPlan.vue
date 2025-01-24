<template>
<!--  产品规划-->
  <div class="content">
    <image-load filePath="productbg.png" class="img-bg"></image-load>
    <div class="toBack" @click="$router.push('/')">
      <svg-load name="back2" class="back"></svg-load>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.content {
  font-size: 0;
  min-height: 100vh;
  position: relative;
  .img-bg {
    height: 100%;
    width: 100%;
  }
  .toBack {
    position: absolute;
    top: 30px;
    left: 20px;
    .back {
      font-size: 18px;
    }
  }
}
</style>
