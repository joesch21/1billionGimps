"use client";

import { useEffect, useState } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

// Import the list of NFT contracts (assuming you have this available in your code)
import { NFT_CONTRACTS } from "@/consts/nft_contracts";

const contractAddress = "0xF09334a9027b263096b772b0F46D271E90b53F3E"; // Main contract address

export default function Home() {
  const [nftImages, setNftImages] = useState<string[]>([]);
  const rpcUrl = process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://bsc-dataseed.binance.org/";

  useEffect(() => {
    async function fetchNFTs() {
      try {
        const sdk = new ThirdwebSDK({
          name: "Binance Smart Chain",
          chainId: 56,
          rpc: [rpcUrl],
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
          },
          shortName: "bsc",
          chain: "bsc-mainnet",
          testnet: false,
          slug: "bsc",
        });

        let allImages: string[] = [];

        if (contractAddress && contractAddress.length === 42 && contractAddress.startsWith("0x")) {
          const contract = await sdk.getContract(contractAddress, "marketplacev3");
          const listings = await contract.call("getAllValidListings", [0, 100]);

          listings.reverse().forEach((listing: any) => {
            let image = listing.asset.image;
            if (!image) {
              image = "/images/IMG_7731.png"; // Use the local fallback image if no image is found
            }
            if (image) {
              allImages.push(image);
            }
          });
        }

        setNftImages(allImages);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    }

    fetchNFTs();
  }, [rpcUrl]);

  // Use the first contract in NFT_CONTRACTS as the link target (or set your own route here)
  const collectionLink = NFT_CONTRACTS.length > 0
    ? `/collection/${NFT_CONTRACTS[0].chain.id}/${NFT_CONTRACTS[0].address}`
    : `/collection/${contractAddress}`;

  return (
    <div>
      <header style={{ backgroundColor: 'black', padding: '10px', textAlign: 'center' }}>
        <img src="/erc20-icons/logo.png" alt="Logo" style={{ width: '50px', display: 'block', margin: '0 auto' }} />
        <h1 style={{ color: 'yellow', marginTop: '10px' }}>Gold Condor Capital</h1>
      </header>

      <Flex direction="column" align="center">
        <Box mt="24px">
          <Card border="1px" maxW="90vw" mx="auto">
            <CardHeader textAlign="center">
              <Heading size="lg">Gimp Collection</Heading>
            </CardHeader>

            <CardBody>
              {/* Make the large image clickable and link it to the NFT collection page */}
              <Box
                as="a"
                href={collectionLink} // Link to the collection route
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ transform: "scale(1.02)" }}
                transition="transform 0.2s ease-in-out"
              >
                <Image
                  src="/images/IMG_7731.png"
                  alt="Main Gimp Collection Image"
                  fallbackSrc="/images/IMG_7731.png"
                  objectFit="cover"
                  width="100%"
                  height="auto"
                  borderRadius="md"
                  maxW={{ base: "100%", md: "80vw", lg: "70vw" }}
                  boxShadow="lg"
                />
              </Box>
              <Stack mt="4" divider={<StackDivider />} spacing="4" textAlign="center">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Description
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    1 Trillion Gimps by Ock Draws
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </div>
  );
}
