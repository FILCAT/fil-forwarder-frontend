//////////////////////////////////////
// React and UI Component Libraries 
//////////////////////////////////////
import React from 'react';
import {
  Button,
  Box,
  ChakraProvider,
  Heading,
  Text,
  theme,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

//////////////////////////////////////
// Icons
//////////////////////////////////////
import { AiOutlineLink } from 'react-icons/ai';

//////////////////////////////////////
// FIL Forwarder React Components
//////////////////////////////////////
import { Nav } from './Nav.js';

//////////////////////////////////////
// Wallet, Network, Contracts
//////////////////////////////////////
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';

//////////////////////////////////////
// Wallet Configuration
//////////////////////////////////////
const hyperspace = {
  id: 3_141,
  name: 'Filecoin Hyperspace',
  network: 'Hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: "https://api.hyperspace.node.glif.io/rpc/v1"
  }
}

const calibration = {
  id: 314_159,
  name: 'Filecoin Calibration',
  network: 'Calibration',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: "https://api.calibration.node.glif.io/rpc/v1"
  }
}

// Choose which chains you'd like to show
const {chains, provider, webSocketProvider} = configureChains([hyperspace, calibration], [
  publicProvider(),
]);

const client = createClient({
  connectors: [
    new MetaMaskConnector({chains}),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Fil Forwarder',
      }
    }),
    new WalletConnectConnector({chains}),
  ],
  provider,
  webSocketProvider,
});

export function BigConnectButton() {
  return <ConnectKitButton.Custom>
    {({ isConnected, isConnecting, show, hide, address, ensName, chain}) => {
      return !isConnected && <Button
        colorScheme='blue'
        size='lg' 
        leftIcon={<AiOutlineLink/>}
        onClick={show}>Connect Wallet</Button>
    }}
  </ConnectKitButton.Custom>
}

function App() {
  return <ChakraProvider theme={theme}>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme='default' mode={useColorModeValue('light', 'dark')}>
        <Nav/>
        <VStack mt='3em'>
          <Heading>Welcome to FIL Forwarder</Heading>
          <Text fontSize='md' fontWeight='normal'>Send Filecoin from an Ethereum Wallet to Any Filecoin Address</Text>
          <Box p='3em'><BigConnectButton/></Box>
        </VStack>
      </ConnectKitProvider>
    </WagmiConfig>
  </ChakraProvider>
}

export default App;
