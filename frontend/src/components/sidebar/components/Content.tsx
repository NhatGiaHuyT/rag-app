'use client';
import {
  Box, Button, Center, Flex, Icon, Menu, MenuButton, MenuList,
  Stack, Text, useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SidebarContent(props: SidebarContent) {
  const { routes, setApiKey } = props;
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue('4px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'none');
  const gray = useColorModeValue('gray.500', 'white');
  const avatarBg = useColorModeValue('#11047A', '#4318FF');

  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  return (
    <Flex direction="column" height="100%" pt="20px" pb="26px" borderRadius="30px" maxW="285px" px="20px">
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="60px" width={'100%'} display={'flex'} justifyContent={'center'}>
        <SidebarCard />
      </Box>
      <APIModal setApiKey={setApiKey} sidebar={true} />

      {isLoggedIn ? (
        <Flex mt="8px" justifyContent="center" alignItems="center" boxShadow={shadowPillBar} borderRadius="30px" p="14px">
          {/* Avatar */}
          <Box position="relative" me="10px" flexShrink={0}>
            <Box w="34px" h="34px" borderRadius="50%" bg={avatarBg} />
            <Center top={0} left={0} position="absolute" w="100%" h="100%">
              <Text fontSize="10px" fontWeight="bold" color="white">{getInitials(user?.name || 'U')}</Text>
            </Center>
          </Box>
          <Text color={textColor} fontSize="xs" fontWeight="600" me="10px" noOfLines={1} maxW="90px">
            {user?.name}
          </Text>
          {/* Settings menu */}
          <Menu>
            <MenuButton
              as={Button} variant="transparent" aria-label="settings"
              border="1px solid" borderColor={borderColor} borderRadius="full"
              w="34px" h="34px" px="0px" p="0px" minW="34px" me="10px"
              justifyContent="center" alignItems="center" color={iconColor}
            >
              <Flex align="center" justifyContent="center">
                <Icon as={MdOutlineSettings} width="18px" height="18px" color="inherit" />
              </Flex>
            </MenuButton>
            <MenuList ms="-20px" py="20px" ps="20px" pe="20px" w="230px"
              borderRadius="16px" transform="translate(-19px, -62px)!important"
              border="0px" boxShadow={shadow} bg={bgColor}
            >
              <Box mb="16px">
                <NavLink href="/settings">
                  <Flex align="center" cursor="pointer" _hover={{ opacity: 0.75 }} transition="0.2s">
                    <Icon as={MdOutlineManageAccounts} width="22px" height="22px" color={gray} me="12px" />
                    <Text color={textColor} fontWeight="500" fontSize="sm">Profile Settings</Text>
                  </Flex>
                </NavLink>
              </Box>
              <Box mb="16px">
                <NavLink href="/history">
                  <Flex align="center" cursor="pointer" _hover={{ opacity: 0.75 }} transition="0.2s">
                    <Icon as={LuHistory} width="22px" height="22px" color={gray} me="12px" />
                    <Text color={textColor} fontWeight="500" fontSize="sm">History</Text>
                  </Flex>
                </NavLink>
              </Box>
              <Box mb="16px">
                <NavLink href="/usage">
                  <Flex align="center" cursor="pointer" _hover={{ opacity: 0.75 }} transition="0.2s">
                    <Icon as={RoundedChart} width="22px" height="22px" color={gray} me="12px" />
                    <Text color={textColor} fontWeight="500" fontSize="sm">Usage</Text>
                  </Flex>
                </NavLink>
              </Box>
            </MenuList>
          </Menu>
          {/* Logout */}
          <Button
            variant="transparent" border="1px solid" borderColor={borderColor}
            borderRadius="full" w="34px" h="34px" px="0px" minW="34px"
            justifyContent="center" alignItems="center" onClick={handleLogout}
            title="Log out"
          >
            <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
          </Button>
        </Flex>
      ) : (
        // Not logged in → show Sign In button
        <Flex mt="8px" justifyContent="center" p="14px">
          <NavLink href="/sign-in" styles={{ width: '100%' }}>
            <Button variant="primary" w="100%" h="40px" borderRadius="14px" fontSize="sm">
              Sign In
            </Button>
          </NavLink>
        </Flex>
      )}
    </Flex>
  );
}

export default SidebarContent;
