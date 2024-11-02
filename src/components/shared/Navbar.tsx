"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon, FaBars } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import { SideMenu } from "./SideMenu";

// Constants for GCC token
const tokenAddress = "0x092ac429b9c3450c9909433eb0662c3b7c13cf9a";
const tokenSymbol = "GCC";
const tokenDecimals = 18;
const tokenImage = "https://storage.top100token.com/images/fe7c179d-bfa8-4d49-a460-ca87ca248167.webp";

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { colorMode } = useColorMode();

  // Function to add GCC Token to MetaMask
  // Function to add GCC Token to MetaMask
async function addTokenToMetaMask() {
  try {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x38') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
          });
        } catch (switchError: any) { // Use 'any' type for switchError here
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'Binance Smart Chain',
                  nativeCurrency: {
                    name: 'Binance Coin',
                    symbol: 'BNB',
                    decimals: 18,
                  },
                  rpcUrls: ['https://bsc-dataseed.binance.org/'],
                  blockExplorerUrls: ['https://bscscan.com'],
                },
              ],
            });
          } else {
            console.error(switchError);
            alert('Failed to switch to Binance Smart Chain. Please try again.');
            return;
          }
        }
      }

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        } as any, // Add assertion here to bypass TypeScript's type check
      });
      ;

      if (wasAdded) {
        console.log('GCC token added to wallet!');
        alert('GCC token was added to your wallet.');
      } else {
        alert('GCC token was not added to your wallet.');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  } catch (error) {
    console.error("An error occurred while adding the token:", error);
  }
}

  

  return (
    <Box py="30px" px={{ base: "20px", lg: "50px" }} bg="black">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Flex direction="row" alignItems="center">
          <FaBars size={30} color="gold" style={{ marginRight: "10px" }} />
          <Heading
            as={Link}
            href="/"
            _hover={{ textDecoration: "none" }}
            color="gold"
            display={{ base: "none", md: "block" }}
          >
            GIMP MENU
          </Heading>
        </Flex>

        {/* Icons for PancakeSwap, Add GCC Token, Gimporium, and YouTube */}
        <Flex direction="row" alignItems="center" mx="20px" gap="20px">
          <Link href="https://pancakeswap.finance/info/tokens/0x092aC429b9c3450c9909433eB0662c3b7c13cF9A" isExternal>
            <Image src="/images/cake.png" alt="PancakeSwap Logo" width="30px" height="30px" />
          </Link>

          <IconButton
            onClick={addTokenToMetaMask}
            variant="outline"
            colorScheme="yellow"
            icon={<Image src="/images/Designer.png" alt="Add Token Logo" width="20px" height="20px" />}
            aria-label="Add GCC Token to Wallet"
          />

          <Link href="https://gimporium.xyz/" isExternal>
            <Box display="inline-flex" alignItems="center" justifyContent="center">
              <Image
                src="/images/IMG_7731.png"
                alt="Gimporium Logo"
                width="30px"
                height="30px"
                borderRadius="50%"
              />
            </Box>
          </Link>

          <Link href="https://www.youtube.com/@TradingNFTwithGCC/streams" isExternal>
            <Image src="/images/youtube.jpg" alt="YouTube Logo" width="30px" height="30px" borderRadius="50%" />
          </Link>
        </Flex>

        <Box display={{ lg: "block", base: "none" }}>
          <ToggleThemeButton />
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <ConnectButton
              client={client}
              theme={colorMode}
              connectButton={{ style: { height: "56px" } }}
            />
          )}
        </Box>
        <SideMenu />
      </Flex>
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode } = useColorMode();
  return (
    <Menu>
      <MenuButton as={Button} height="56px">
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image
            src={ensAvatar ?? blo(address as `0x${string}`)}
            height="40px"
            rounded="8px"
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem display="flex">
          <Box mx="auto">
            <ConnectButton client={client} theme={colorMode} />
          </Box>
        </MenuItem>
        <MenuItem as={Link} href="/profile" _hover={{ textDecoration: "none" }}>
          Profile {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Button>
  );
}
