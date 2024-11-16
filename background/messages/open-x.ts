import type { PlasmoMessaging } from "@plasmohq/messaging"

const HIDDEN_NUMBER = 541

export type RequestBody = {
  url: number
}

export type RequestResponse = number

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  RequestResponse
> = async (req, res) => {
  const { url } = req.body

  // 尝试使用Firefox的URL scheme打开链接
  const result = window.open(`firefox://open-url?url=${encodeURIComponent(url)}`, '_blank');

  if (result === null || typeof result === 'undefined') {
    // 如果打开失败，可能是浏览器阻止了弹出窗口
    throw new Error('Failed to open the link in Firefox.');
  }
  console.log("Resp Open Result:"+result)
  // res.send(input * HIDDEN_NUMBER)
  console.log("Resp Bg:Message handler body:" + url)
  // return "SUCCESS"
  const message = "Hello from the background script!"

  res.send(1096)
}

export default handler
