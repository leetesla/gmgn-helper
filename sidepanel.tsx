import { useEffect, useState } from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Text,
  List,
  ListItem,
  Button
} from "@chakra-ui/react"

function IndexSidePanel() {
  const [items, setItems] = useState([])

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = () => {
    chrome.storage.local.get(['watchlist'], (result) => {
      setItems(result.watchlist || [])
    })
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    chrome.storage.local.set({ watchlist: newItems }, () => {
      setItems(newItems)
    })
  }

  return (
    <ChakraProvider>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold">Watchlist</Text>
          <List spacing={3}>
            {items.map((item, index) => (
              <ListItem key={index} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold">{item.name}</Text>
                <Text>Target Price: ${item.targetPrice}</Text>
                <Button
                  size="sm"
                  colorScheme="red"
                  mt={2}
                  onClick={() => removeItem(index)}>
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}

export default IndexSidePanel