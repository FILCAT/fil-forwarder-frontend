//////////////////////////////////////
// React and UI Component Libraries 
//////////////////////////////////////
import React from 'react';
import {
  ChakraProvider,
  Heading,
  Text,
  theme,
  VStack,
} from '@chakra-ui/react';

//////////////////////////////////////
// FIL Forwarder React Components
//////////////////////////////////////
import { Nav } from './Nav.js';

//////////////////////////////////////
// Wallet, Network, Contracts
//////////////////////////////////////
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

//////////////////////////////////////
// Wallet Configuration
//////////////////////////////////////
const hyperspace = {
  id: 3_141,
  name: 'Hyperspace',
  network: 'Hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: "https://api.hyperspace.node.glif.io/rpc/v1",
  },
}

// Choose which chains you'd like to show
const {chains, provider, webSocketProvider} = configureChains([hyperspace], [
  publicProvider(),
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Fil Forwarder',
      }
    })
  ],
  provider,
  webSocketProvider,
});

function App() {
  return <ChakraProvider theme={theme}>
    <WagmiConfig client={client}>
      <Nav/>
      <VStack mt='3em'>
        <Heading>Welcome to FIL Forwarder</Heading>
        <Text fontSize='md' fontWeight='normal'>Send Filecoin from an Ethereum Wallet to Any Filecoin Address</Text>
      </VStack>
    </WagmiConfig>
  </ChakraProvider>
}

export default App;
