<template>
  <div class="transaction-component viewBox">
    <h1>为交易而生</h1>
    <div class="animated-number" ref="number1">{{ animatedNumber1 }}</div>
    <div class="text">关联账户</div>
    <div class="animated-number" ref="number2">{{ animatedNumber2 }}</div>
    <div class="text">真实订单</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

export default {
  name: 'TransactionComponent',
  setup() {
    const animatedNumber1 = ref(0)
    const animatedNumber2 = ref(0) // Ensure starting point is 0 for animation

    onMounted(() => {
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 3 })

      timeline.to(
        animatedNumber1,
        {
          value: 63625,
          duration: 2,
          ease: 'none',
          onUpdate: () => {
            animatedNumber1.value = Math.round(animatedNumber1.value)
          }
        },
        0
      )

      timeline.to(
        animatedNumber2,
        {
          value: 68615,
          duration: 2,
          ease: 'none',
          onUpdate: () => {
            animatedNumber2.value = Math.round(animatedNumber2.value)
          }
        },
        0
      )

      timeline.to(
        '.animated-number',
        {
          color: "#00FF7F",
          duration: 0.5,
          repeat: 6,
          yoyo: true,
          ease: 'none'
        },
        2
      ) // Color change starts after the number animation
    })

    return {
      animatedNumber1,
      animatedNumber2
    }
  }
}
</script>

<style scoped>
.transaction-component {
  text-align: center;
  font-family: Arial, sans-serif;
}
.viewBox > h1 {
  font-weight: 700;
  padding-top: 0.45rem;
  color: #fff;
  padding-bottom: 0.8rem;
  font-size: 0.88rem;
}
.animated-number {
  font-size: .863rem;
  transition: color 0.5s ease;
  color: #90EE90;
}

.text {
  margin: 10px 0;
  font-size: 1.2em;
}
</style>
