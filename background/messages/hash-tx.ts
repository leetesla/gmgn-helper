import type { PlasmoMessaging } from "@plasmohq/messaging"

const HIDDEN_NUMBER = 541

export type RequestBody = {
  input: number
}

export type RequestResponse = number

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  RequestResponse
> = async (req, res) => {
  const { input } = req.body

  // res.send(input * HIDDEN_NUMBER)
  console.log("Resp Bg:Message handler body:" + input)
  // return "SUCCESS"
  const message = "Hello from the background script!"

  res.send(1096)
}

export default handler
