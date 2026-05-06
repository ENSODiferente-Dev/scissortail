import { useEffect, useState } from 'react'
import { useExternalScript } from '../hooks/useExternalScript'
import { usePerformanceProfile } from '../hooks/usePerformanceProfile'

const CHAT_SCRIPT_SRC = 'https://widgets.leadconnectorhq.com/loader.js'
const CHAT_MARKER = {
  name: 'data-widget-id',
  value: '69ed0852bd8fe83e24c4cf51',
}
const CHAT_ATTRS = {
  'data-resources-url': 'https://widgets.leadconnectorhq.com/chat-widget/loader.js',
  'data-widget-id': '69ed0852bd8fe83e24c4cf51',
}
const SHADOW_RING_STYLE_ID = 'scs-chat-ring-style'
const SHADOW_RING_CSS = `
@keyframes scs-chat-ring-spin {
  to { transform: rotate(1turn); }
}

@keyframes scs-chat-ring-pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

#lc_text-widget--btn {
  position: fixed !important;
  overflow: visible !important;
  isolation: isolate;
}

#lc_text-widget--btn::before {
  content: "";
  position: absolute;
  inset: -15px;
  border-radius: 9999px;
  pointer-events: none;
  z-index: -1;
  background: conic-gradient(from 0deg, #2563eb 0%, #7c3aed 22%, #ef4444 45%, #dc2626 62%, #3b82f6 82%, #2563eb 100%);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.24), 0 0 12px rgba(220, 38, 38, 0.24);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000 calc(100% - 9px));
  animation: scs-chat-ring-spin 4.8s linear infinite, scs-chat-ring-pulse 2.4s ease-in-out infinite;
}

#lc_text-widget--btn .icon {
  position: relative;
  z-index: 2;
}
`

function forceChatBottomRight() {
  const chatWidgets = document.querySelectorAll('chat-widget')
  const chatContainers = document.querySelectorAll('div[data-chat-widget]')

  if (!chatWidgets.length && !chatContainers.length) {
    return
  }

  chatWidgets.forEach((chatWidget) => {
    chatWidget.setAttribute('position', 'bottom-right')

    try {
      chatWidget.position = 'bottom-right'
    } catch {
      // The widget API may not expose this property.
    }

    chatWidget.style.position = 'fixed'
    chatWidget.style.top = 'auto'
    chatWidget.style.right = '16px'
    chatWidget.style.bottom = '16px'
    chatWidget.style.left = 'auto'
    chatWidget.style.inset = 'auto 16px 16px auto'
    chatWidget.style.transform = 'none'
    chatWidget.style.zIndex = '2147483647'
  })

  chatContainers.forEach((chatContainer) => {
    chatContainer.style.position = 'fixed'
    chatContainer.style.top = 'auto'
    chatContainer.style.right = '16px'
    chatContainer.style.bottom = '16px'
    chatContainer.style.left = 'auto'
    chatContainer.style.inset = 'auto 16px 16px auto'
    chatContainer.style.transform = 'none'
    chatContainer.style.zIndex = '2147483647'
  })
}

function ensureRingInsideWidgetButton() {
  const chatWidget = document.querySelector('chat-widget')
  const shadowRoot = chatWidget?.shadowRoot
  if (!shadowRoot) {
    return
  }

  if (!shadowRoot.getElementById(SHADOW_RING_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = SHADOW_RING_STYLE_ID
    style.textContent = SHADOW_RING_CSS
    shadowRoot.appendChild(style)
  }
}

function LeadConnectorChatLoader() {
  const { shouldReduceEffects } = usePerformanceProfile()
  const [chatEnabled, setChatEnabled] = useState(false)

  useEffect(() => {
    if (chatEnabled) return

    const enableChat = () => {
      setChatEnabled((current) => (current ? current : true))
    }

    const delayMs = shouldReduceEffects ? 7000 : 2500
    const timer = window.setTimeout(enableChat, delayMs)

    window.addEventListener('pointerdown', enableChat, { once: true, passive: true })
    window.addEventListener('keydown', enableChat, { once: true })
    window.addEventListener('touchstart', enableChat, { once: true, passive: true })
    window.addEventListener('scroll', enableChat, { once: true, passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', enableChat)
      window.removeEventListener('keydown', enableChat)
      window.removeEventListener('touchstart', enableChat)
      window.removeEventListener('scroll', enableChat)
    }
  }, [chatEnabled, shouldReduceEffects])

  useExternalScript({
    src: CHAT_SCRIPT_SRC,
    attrs: CHAT_ATTRS,
    markerAttr: CHAT_MARKER,
    enabled: chatEnabled,
  })

  useEffect(() => {
    if (!chatEnabled) return

    forceChatBottomRight()
    ensureRingInsideWidgetButton()

    window.addEventListener('load', forceChatBottomRight)
    window.addEventListener('load', ensureRingInsideWidgetButton)

    const observer = new MutationObserver(() => {
      forceChatBottomRight()
      ensureRingInsideWidgetButton()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    let tries = 0
    const timer = window.setInterval(() => {
      forceChatBottomRight()
      ensureRingInsideWidgetButton()
      tries += 1
      if (tries >= 40) {
        window.clearInterval(timer)
      }
    }, 500)

    return () => {
      window.removeEventListener('load', forceChatBottomRight)
      window.removeEventListener('load', ensureRingInsideWidgetButton)
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [chatEnabled])

  return null
}

export default LeadConnectorChatLoader
