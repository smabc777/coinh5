// CurrencyExchange.vue
<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">货币汇率转换器</h2>
    
    <!-- 基准货币选择 -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">基准货币:</label>
      <select 
        v-model="baseCurrency"
        @change="fetchRates"
        class="border rounded p-2 w-full max-w-xs"
      >
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
    </div>

    <!-- 金额输入 -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">金额:</label>
      <input 
        type="number" 
        v-model="amount"
        class="border rounded p-2 w-full max-w-xs"
      />
    </div>
 {{ gggg }}
    <!-- 汇率展示 -->
    <div v-if="rates" class="space-y-4">
      <div v-for="(rate, currency) in rates" :key="currency" 
           class="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-center">
          <span class="font-medium">{{ currency }}</span>
          <div class="text-right">
            <div class="text-lg font-semibold">
              {{ (rate * amount).toFixed(2) }}
            </div>
            <div class="text-sm text-gray-500">
              汇率: {{ rate }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-4">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="text-red-500 mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currencies = ['USD', 'EUR', 'CNY', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD']
const baseCurrency = ref('USD')
const amount = ref(1)
const rates = ref(null)
const loading = ref(false)
const error = ref(null)
const gggg = ref(0)
const fetchRates = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 这里使用 ExchangeRate-API 的免费 API
    // 注意：实际使用时需要替换为你自己的 API key
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${baseCurrency.value}`
    )
    const data = await response.json()
    if (data.rates) {
      // 只保留我们关心的货币
      gggg.value = data.rates['USD']
     
        
    } else {
      throw new Error('无法获取汇率数据')
    }
  } catch (e) {
    error.value = '获取汇率数据失败，请稍后再试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRates)
</script>