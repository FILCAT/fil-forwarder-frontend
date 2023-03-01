//////////////////////////////////////
// React and UI Component Libraries 
//////////////////////////////////////
import {
  Button,
  Box,
  ChakraProvider,
  FormControl,
  FormLabel,
  Select,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  Spinner,
  theme,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

//////////////////////////////////////
// Icons
//////////////////////////////////////
import { AiOutlineLink } from 'react-icons/ai';

//////////////////////////////////////
// FIL Forwarder React Components
//////////////////////////////////////
import { Nav } from './Nav.js';

//////////////////////////////////////
// Filecoin Specific Tools
//////////////////////////////////////
// import { Address } from '@zondax/izari-tools';

//////////////////////////////////////
// Wallet, Network, Contracts
//////////////////////////////////////
import { ethers, BigNumber } from 'ethers';
import { 
  WagmiConfig, 
  createClient, 
  configureChains,
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork
} from "wagmi";
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

//////////////////////////////////////
// React Function Components 
//////////////////////////////////////

/**
 * BigConnectButton
 *
 * This is a simple re-styling of the ConnectKit
 * button to be bigger and easier to see.
 */
export function BigConnectButton() {
  return <ConnectKitButton.Custom>
    {({ isConnected, isConnecting, show, hide, address, ensName, chain}) => {
      return !isConnected && <Box p='3em'>
        <Button
        colorScheme='blue'
        size='lg' 
        leftIcon={<AiOutlineLink/>}
        onClick={show}>Connect Wallet</Button>
      </Box>
    }}
  </ConnectKitButton.Custom>
}

/**
 * SendFilForm
 *
 * This is the meat of the app, which only
 * shows once the wallet is connected. It does
 * all of the validation, and does the interaction
 * with the smart contract.
 */
export function SendFilForm() {
  // reads
  const network = useNetwork();
  const account = useAccount();
  const balance = useBalance({
    addressOrName: account.address,
    watch: true
  });

  // state
  const [sendAmount, setSendAmount] = useState(0);
  const [destination, setDestination] = useState('');

  // errors
  const hasSendAmountError = !balance.isSuccess || BigNumber.from(0).eq(sendAmount) || 
    balance.data.value.lt(sendAmount);
  const hasDestinationError = false;

  // writes
  const switcher = useSwitchNetwork();

  // for simplicity sake, lets make sure we have everything we need
  if (!network.chain || !balance.isSuccess) {
    return account.isConnected ? <Spinner size='xl'/> : '';
  }

  return <VStack spacing='2em' pt='3em'>
    <FormControl>
      <FormLabel>Network</FormLabel>
      <Select value={network.chain.id} size='lg' onChange={(e) => switcher.switchNetwork(parseInt(e.target.value))}> 
        { network.chains.map((c) => 
        <option key={c.id} value={c.id}>{c.name} (id: {c.id})</option> ) }
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel>Your Address</FormLabel>
      <Text>{account.address}</Text>
    </FormControl>
    <FormControl>
      <FormLabel>Your Balance</FormLabel>
      <Text>{balance.data.formatted} {balance.data.symbol}</Text> 
    </FormControl>
    <FormControl isInvalid={hasSendAmountError}>
      <FormLabel>Send Amount</FormLabel>
      <InputGroup>
      <NumberInput min={0} width='100%'>
        <NumberInputField onChange={(e) => {
          setSendAmount(e.target.value.length < 1 ? 0 : 
            ethers.utils.parseEther(e.target.value)); 
        }}/>
      </NumberInput>
      <InputRightElement>
        <Text color='gray'>{balance.data.symbol}</Text>
      </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl isInvalid={hasDestinationError}>
      <FormLabel>Desintation Address</FormLabel>
      <Input placeholder="t01024"
        _placeholder={{ color: 'gray.500' }}
        onChange={(e) => {setDestination(e.target.value);}}/>
    </FormControl>
  </VStack>
}

/**
 * App
 *
 * This is the entrance and top level component of
 * the app itself.
 */
function App() {
  return <ChakraProvider theme={theme}>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme='default' mode={useColorModeValue('light', 'dark')}>
        <Nav/>
        <VStack mt='3em'>
          <Heading>Welcome to FIL Forwarder</Heading>
          <Text fontSize='md' fontWeight='normal'>Send Filecoin from an Ethereum Wallet to Any Filecoin Address</Text>
          <BigConnectButton/>
          <SendFilForm/>
        </VStack>
      </ConnectKitProvider>
    </WagmiConfig>
  </ChakraProvider>
}

export default App;
