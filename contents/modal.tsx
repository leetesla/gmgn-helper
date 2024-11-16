import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel
} from "@chakra-ui/react"
import "~style.css"

export const config: PlasmoCSConfig = {
  matches: ["https://gmgn.ai/sol/token*"]
}

function PriceModal({ isOpen, onClose, tokenName }) {
  const [name, setName] = useState(tokenName)
  const [targetPrice, setTargetPrice] = useState("")

  const handleSave = () => {
    chrome.storage.local.get(['watchlist'], (result) => {
      const currentList = result.watchlist || []
      const newList = [...currentList, { name, targetPrice: parseFloat(targetPrice) }]
      chrome.storage.local.set({ watchlist: newList }, () => {
        onClose()
      })
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="green"
        boxShadow="lg"
        borderRadius="md"
        maxWidth="500px"
        maxHeight="300px"
        mx="auto"
        opacity={1}
      >
        <ModalHeader>Add to Watchlist</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Token Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Target Price ($)</FormLabel>
            <Input
              type="number"
              step="0.000001"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Enter target price"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PriceModal
