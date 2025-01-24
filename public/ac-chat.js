class ACChat {
  baseUrl = ''
  visiter_id = ''
  visiter_name = ''
  iframe = null

  constructor() {
    this.visiter_id = localStorage.getItem('acchat_visiter_id') || `tourists_${Date.now()}`
    this.visiter_name = localStorage.getItem('acchat_visiter_name') || `tourists_${Date.now()}`
    window.addEventListener('message', (event) => {
      const data = event.data
      if (data == '__ACChat_hide') {
        this.hide()
      }
    })
  }

  setBaseUrl = (baseUrl = '') => {
    this.baseUrl = baseUrl || ''
    this.loadIframe()
  }

  loadIframe = () => {
    let tempUrl = `${this.baseUrl}&visiter_id=${this.visiter_id}&visiter_name=${this.visiter_name}&type=acchat`
    if (!this.iframe) {
      // 创建 iframe 元素
      this.iframe = document.createElement('iframe')
      this.iframe.allow =
        'clipboard-read; clipboard-write; autoplay; microphone *; camera *; display-capture *; picture-in-picture *; fullscreen *;'
      this.iframe.style.overflow = 'hidden'
      this.iframe.style.position = 'fixed'
      this.iframe.style.bottom = '0'
      this.iframe.style.right = '0'
      this.iframe.style.border = '0'

      this.hide()
      document.body.appendChild(this.iframe)
    }
    if (this.baseUrl && tempUrl != this.iframe.src) {
      // 设置 iframe 的 src
      this.iframe.src = tempUrl
    }
  }

  setUser = (user) => {
    this.visiter_id = user.id || this.visiter_id
    this.visiter_name = user.name || this.visiter_name
    localStorage.setItem('acchat_visiter_id', this.visiter_id)
    localStorage.setItem('acchat_visiter_name', this.visiter_name)
    this.loadIframe()
  }

  back() {
    if (location.href.indexOf('type=acchat') > -1) {
      window?.parent?.postMessage('__ACChat_hide', '*')
    } else {
      window.history.back(-1)
    }
  }

  // 显示 iframe
  show = () => {
    this.iframe.style.width = '100vw'
    this.iframe.style.height = '100vh'
    this.iframe.style.zIndex = '999'
    this.iframe.style.transition = 'all 0.3s ease'
    this.iframe.style.opacity = '1'
  }

  // 隐藏 iframe
  hide = () => {
    this.iframe.style.transition = 'opacity 0.2s ease'
    this.iframe.style.width = '0'
    this.iframe.style.height = '0'
    this.iframe.style.zIndex = '-1'
    this.iframe.style.opacity = '0'
  }
}

window.__ACChat = new ACChat()
