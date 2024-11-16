import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import PriceModal from "./modal"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://gmgn.ai/sol/token*"]
}

const addWatchButton = () => {
  const shareButton = document.querySelector("[data-sentry-component=\"ShareMessage\"]")
  if (!shareButton || document.getElementById("watch-button")) return

  const button = document.createElement("div")
  button.id = "watch-button"
  button.style.cssText = "cursor: pointer; margin-left: 10px;"
  button.innerHTML = `
    <div class="css-1gojk8">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5C6068" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <div class="css-1a888aa">Add to List</div>
    </div>
  `

  shareButton.parentNode.insertBefore(button, shareButton.nextSibling)
  return button
}

const addNavToXButton = () => {
  const shareButton = document.querySelector("[data-sentry-component=\"ShareMessage\"]")
  if (!shareButton || document.getElementById("watch-button")) return

  const button = document.createElement("div")
  button.id = "nav-to-x-button"
  button.style.cssText = "cursor: pointer; margin-left: 10px;"
  button.innerHTML = `
    <div class="css-1gojk8">
      <div class="css-1a888aa">打开</div>
      <div data-key="twitter" datatype="out" class="css-11j8qss">
          <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" fill="currentColor" viewBox="0 0 12 12">
          <g clip-path="url(#clip0_7920_513)"><path d="M9.282 1h1.71L7.255 5.27l4.394 5.809H8.21L5.515 7.555 2.43 11.08H.721l3.995-4.567L.5 1h3.528l2.436 3.22L9.282 1zm-.6 9.056h.947L3.513 1.97H2.497l6.185 8.086z"></path></g>
          <defs><clipPath id="clip0_7920_513"><rect width="12" height="12"></rect></clipPath></defs>
          </svg>
      </div>
    </div>
  `

  shareButton.parentNode.insertBefore(button, shareButton.nextSibling)
  return button
}

const watchPrice = () => {
  const priceElement = document.querySelector("[data-sentry-element=\"Flex\"][data-sentry-source-file=\"BaseInfoPriceView.tsx\"]")
  if (!priceElement) return

  const currentPrice = parseFloat(priceElement.textContent.replace("$", ""))

  chrome.storage.local.get(["watchlist"], (result) => {
    const watchlist = result.watchlist || []
    watchlist.forEach(item => {
      if (currentPrice > item.targetPrice) {
        const audio = new Audio(chrome.runtime.getURL("alert.mp3"))
        audio.play()
      }
    })
  })
}

function WatchlistApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tokenName, setTokenName] = useState("")

  useEffect(() => {
    const button = addWatchButton()
    if (button) {
      button.addEventListener('click', () => {
        const nameElement = document.querySelector('[data-sentry-element="Flex"][data-sentry-source-file="BaseInfoBar.tsx"] .chakra-text')
        if (nameElement) {
          setTokenName(nameElement.textContent)
          setIsModalOpen(true)
        }
      })
    }

    const priceInterval = setInterval(watchPrice, 5000)
    return () => clearInterval(priceInterval)
  }, [])

  useEffect(() => {
    const xbutton = addNavToXButton()
    if (xbutton) {
      const handleClick = async () => {
        window.open("openinfirefox://www.x.com?q=elon-1");
        // 发送消息给后台脚本，要求打开链接
        // const resp = await sendToBackground({
        //   // @ts-ignore
        //   name: "open-x",
        //   body: {
        //     url: "https://www.x.com"
        //   }
        // })
        //
        // console.log("resp:" + resp)
        //
        // if (resp.error) {
        //   console.error("Failed to open link in Firefox:", resp.error)
        // }
      }

      xbutton.addEventListener("click", handleClick)

      // 清理函数
      return () => {
        xbutton.removeEventListener("click", handleClick)
      }
    }
  }, [])



  return (
    <PriceModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      tokenName={tokenName}
    />
  )
}

const root = document.createElement("div")
root.id = "plasmo-root"
document.body.appendChild(root)
createRoot(root).render(<WatchlistApp />)
