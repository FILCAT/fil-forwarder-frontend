import {
  Box,
  HStack,
  Flex,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { FIL } from './icon/FIL.js';

const NavLink = ({label, href}) => ( 
  <Link px={2} py={1} rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}>{label}
  </Link>
);

export function Nav() {
  return <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
    <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
      <Box>
        <HStack>
          <FIL size='48px'/>
          <b>Fil Forwarder</b>
        </HStack>
      </Box>
      <Flex alignItems={'center'}>
        <Stack direction={'row'} spacing={7}>
          <NavLink label='Documentation' href='https://spec.filecoin.io/appendix/address/'/>
          <ColorModeSwitcher/>
        </Stack>
      </Flex>
    </Flex>
  </Box>
}
