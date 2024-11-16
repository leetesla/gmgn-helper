import { useEffect, useState } from "react"
import { ChakraProvider, Box, VStack, Button, Text } from "@chakra-ui/react"

function IndexPopup() {
  const [items, setItems] = useState([])
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['watchlist'], (result) => {
      setItems(result.watchlist || [])
    })
  }, [])

  const openSidePanel = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tab) {
        if (isPanelOpen) {
          // chrome.sidePanel.open();
          // await chrome.sidePanel.setOptions({
          //   tabId: tab.id,
          //   // path: 'sidepanel-tab.html',
          //   enabled: false
          // });
        } else {
          // await chrome.sidePanel.setOptions({
          //   tabId: tab.id,
          //   // path: 'sidepanel-tab.html',
          //   enabled: true
          // });
          chrome.sidePanel.open({ tabId: tab.id } as chrome.sidePanel.OpenOptions);
        }
        setIsPanelOpen(!isPanelOpen);
      }
    } catch (error) {
      console.error("Error toggling side panel:", error);
    }
  };

  return (
    <ChakraProvider>
      <Box p={4} width="300px">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">GMGN Helper</Text>
          <Button colorScheme="blue" onClick={openSidePanel} width="100%">
            Open Side Panel
          </Button>
          <Text>Watching {items.length} items</Text>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}

export default IndexPopup
