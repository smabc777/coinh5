<template>
  <div class="wallet-container">
    <!-- 钱包连接按钮 -->
    <div v-if="!isConnected" class="connect-section">
      <h2>连接钱包</h2>
      <div class="wallet-options">
        <button 
          v-for="wallet in availableWallets" 
          :key="wallet.name"
          @click="connectWallet(wallet.name)"
          :disabled="!wallet.available"
          class="wallet-button"
          :class="{ disabled: !wallet.available }"
        >
          <img :src="wallet.icon" :alt="wallet.name" class="wallet-icon">
          <span>{{ wallet.name }}</span>
          <span v-if="!wallet.available" class="not-available">未安装</span>
        </button>
      </div>
    </div>

    <!-- 已连接状态 -->
    <div v-else class="connected-section">
      <div class="wallet-info">
        <div class="current-wallet">
          <img :src="currentWallet.icon" :alt="currentWallet.name" class="wallet-icon-small">
          <span>{{ currentWallet.name }}</span>
        </div>
        <div class="account-info">
          <div class="address">{{ shortenAddress(account) }}</div>
          <div class="balance">{{ balance }} ETH</div>
          <div class="network">网络: {{ networkName }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="switchWallet" class="switch-btn">切换钱包</button>
        <button @click="disconnect" class="disconnect-btn">断开连接</button>
      </div>
    </div>

    <!-- 钱包切换模态框 -->
    <div v-if="showSwitchModal" class="modal-overlay" @click="closeSwitchModal">
      <div class="modal-content" @click.stop>
        <h3>选择钱包</h3>
        <div class="wallet-list">
          <div 
            v-for="wallet in availableWallets" 
            :key="wallet.name"
            @click="switchToWallet(wallet.name)"
            :class="['wallet-item', { 
              disabled: !wallet.available,
              current: wallet.name === currentWallet.name 
            }]"
          >
            <img :src="wallet.icon" :alt="wallet.name" class="wallet-icon-small">
            <span>{{ wallet.name }}</span>
            <span v-if="wallet.name === currentWallet.name" class="current-tag">当前</span>
            <span v-else-if="!wallet.available" class="not-available">未安装</span>
          </div>
        </div>
        <button @click="closeSwitchModal" class="close-btn">关闭</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'

export default {
  name: 'WalletLogin',
  setup() {
    const isConnected = ref(false)
    const isLoading = ref(false)
    const loadingMessage = ref('')
    const account = ref('')
    const balance = ref('0.0000')
    const networkName = ref('以太坊主网')
    const showSwitchModal = ref(false)
    
    const currentWallet = ref({
      name: '',
      icon: ''
    })

    const availableWallets = reactive([
      {
        name: 'MetaMask',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iI0Y2ODUxQiIvPgo8cGF0aCBkPSJNMjUuNSA3TDIwIDEyIDIyIDEwTDI1LjUgN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02LjUgN0wxMiAxMkwxMCAxMEw2LjUgN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAxNkwxNiAyMEwxMiAxNkwxNiAxMkwyMCAxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
        available: false,
        provider: null
      },
      {
        name: 'WalletConnect',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzNCOTlGQyIvPgo8cGF0aCBkPSJNMTAgMTJIMjJWMjBIMTBWMTJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTEyIDE2SDE2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
        available: true,
        provider: null
      },
      {
        name: 'Coinbase Wallet',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzAwNTJGRiIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgcng9IjIiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
        available: false,
        provider: null
      }
    ])

    // 检查钱包可用性
    const checkWalletAvailability = () => {
      // 检查 MetaMask
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
        const metamaskWallet = availableWallets.find(w => w.name === 'MetaMask')
        if (metamaskWallet) {
          metamaskWallet.available = true
          metamaskWallet.provider = window.ethereum
        }
      }

      // 检查 Coinbase Wallet
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isCoinbaseWallet) {
        const coinbaseWallet = availableWallets.find(w => w.name === 'Coinbase Wallet')
        if (coinbaseWallet) {
          coinbaseWallet.available = true
          coinbaseWallet.provider = window.ethereum
        }
      }
    }

    // 连接钱包
    const connectWallet = async (walletName) => {
      const wallet = availableWallets.find(w => w.name === walletName)
      if (!wallet || !wallet.available) return

      isLoading.value = true
      loadingMessage.value = `正在连接 ${walletName}...`

      try {
        if (walletName === 'MetaMask' || walletName === 'Coinbase Wallet') {
          await connectEthereumWallet(wallet)
        } else if (walletName === 'WalletConnect') {
          await connectWalletConnect()
        }
      } catch (error) {
        console.error('连接钱包失败:', error)
        alert('连接钱包失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }

    // 连接以太坊钱包 (MetaMask, Coinbase)
    const connectEthereumWallet = async (wallet) => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      console.log(accounts,'....999999');

      if (accounts.length === 0) {
        throw new Error('未找到账户')
      }

      account.value = accounts[0]
      currentWallet.value = wallet
      isConnected.value = true

      // 获取余额
      await updateBalance(wallet.provider)
      
      // 获取网络信息
      await updateNetwork(wallet.provider)

      // 监听账户变化
      wallet.provider.on('accountsChanged', handleAccountsChanged)
      wallet.provider.on('chainChanged', handleChainChanged)
    }

    // 连接 WalletConnect
    const connectWalletConnect = async () => {
      // 这里需要集成 WalletConnect SDK
      // 为了演示，我们模拟连接过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      account.value = '0x742d35Cc6634C0532925a3b8D67B73a2e3B4C5f8'
      currentWallet.value = availableWallets.find(w => w.name === 'WalletConnect')
      isConnected.value = true
      balance.value = '1.2340'
    }

    // 更新余额
    const updateBalance = async (provider) => {
      try {
        const balanceWei = await provider.request({
          method: 'eth_getBalance',
          params: [account.value, 'latest']
        })
        const balanceEth = parseInt(balanceWei, 16) / Math.pow(10, 18)
        balance.value = balanceEth.toFixed(4)
      } catch (error) {
        console.error('获取余额失败:', error)
      }
    }

    // 更新网络信息
    const updateNetwork = async (provider) => {
      try {
        const chainId = await provider.request({ method: 'eth_chainId' })
        const networkMap = {
          '0x1': '以太坊主网',
          '0x89': 'Polygon',
          '0x38': 'BSC',
          '0xa4b1': 'Arbitrum'
        }
        networkName.value = networkMap[chainId] || `网络 ${chainId}`
      } catch (error) {
        console.error('获取网络信息失败:', error)
      }
    }

    // 处理账户变化
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        account.value = accounts[0]
        updateBalance(currentWallet.value.provider)
      }
    }

    // 处理网络变化
    const handleChainChanged = (chainId) => {
      updateNetwork(currentWallet.value.provider)
    }

    // 切换钱包
    const switchWallet = () => {
      showSwitchModal.value = true
    }

    // 切换到指定钱包
    const switchToWallet = async (walletName) => {
      if (walletName === currentWallet.value.name) {
        closeSwitchModal()
        return
      }

      const wallet = availableWallets.find(w => w.name === walletName)
      if (!wallet || !wallet.available) return

      // 断开当前连接
      await disconnect(false)
      
      // 连接新钱包
      await connectWallet(walletName)
      closeSwitchModal()
    }

    // 关闭切换模态框
    const closeSwitchModal = () => {
      showSwitchModal.value = false
    }

    // 断开连接
    const disconnect = async (showMessage = true) => {
      // 清理监听器
      if (currentWallet.value.provider && currentWallet.value.provider.removeAllListeners) {
        currentWallet.value.provider.removeAllListeners('accountsChanged')
        currentWallet.value.provider.removeAllListeners('chainChanged')
      }

      isConnected.value = false
      account.value = ''
      balance.value = '0.0000'
      networkName.value = '以太坊主网'
      currentWallet.value = { name: '', icon: '' }
      
      if (showMessage) {
        alert('已断开钱包连接')
      }
    }

    // 地址缩短显示
    const shortenAddress = (address) => {
      if (!address) return ''
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    onMounted(() => {
      checkWalletAvailability()
    })

    return {
      isConnected,
      isLoading,
      loadingMessage,
      account,
      balance,
      networkName,
      showSwitchModal,
      currentWallet,
      availableWallets,
      connectWallet,
      switchWallet,
      switchToWallet,
      closeSwitchModal,
      disconnect,
      shortenAddress
    }
  }
}
</script>

<style scoped>
.wallet-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.connect-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wallet-button {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.wallet-button:hover:not(.disabled) {
  border-color: #007AFF;
  background: #f8f9ff;
}

.wallet-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.wallet-icon-small {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.not-available {
  margin-left: auto;
  color: #999;
  font-size: 14px;
}

.connected-section {
  text-align: center;
}

.wallet-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.current-wallet {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: #333;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address {
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: #007AFF;
}

.balance {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.network {
  font-size: 14px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.switch-btn, .disconnect-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.switch-btn {
  background: #007AFF;
  color: white;
}

.switch-btn:hover {
  background: #005ce6;
}

.disconnect-btn {
  background: #ff3b30;
  color: white;
}

.disconnect-btn:hover {
  background: #e6342a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  min-width: 300px;
  max-width: 400px;
}

.modal-content h3 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.wallet-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.wallet-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.wallet-item:hover:not(.disabled) {
  background: #f0f0f0;
}

.wallet-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wallet-item.current {
  background: #e6f3ff;
  border: 2px solid #007AFF;
}

.current-tag {
  margin-left: auto;
  color: #007AFF;
  font-size: 12px;
  font-weight: 600;
}

.close-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg) }
}
</style>