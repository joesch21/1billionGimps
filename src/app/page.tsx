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
  Link,
} from "@chakra-ui/react";

// Import the list of NFT contracts (assuming you have this available in your code)
import { NFT_CONTRACTS } from "@/consts/nft_contracts";

const contractAddress = "0x36cda97E72911E85781486a5C182baeC87071d20"; // Main contract address

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
          shortName: "bscTestnet",
          chain: "bscTestnet",
          testnet: false,
          slug: "bscTestnet",
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
        {/* Promotional Text */}
        <Box mt="4" textAlign="center" padding="10px" maxWidth="750px">
          <Text fontSize="lg" fontWeight="bold">
            The largest Digital Art Collection is now absolutely free! All you need is tBNB to mint an NFT!
          </Text>
          <Text>
            <Link href="https://www.bnbchain.org/en/testnet-faucet" color="purple.500" isExternal>
              Get tBNB from the BNB Chain Testnet Faucet
            </Link>.
          </Text>
        </Box>

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

        {/* Embed the NFT minting iframe */}
        <Box mt="4" width="100%" maxWidth="750px" mx="auto">
          <iframe
            src="https://embed.ipfscdn.io/ipfs/bafybeicd3qfzelz4su7ng6n523virdsgobrc5pcbarhwqv3dj3drh645pi/?contract=0x36cda97E72911E85781486a5C182baeC87071d20&chain=%7B%22name%22%3A%22BNB+Smart+Chain+Testnet%22%2C%22chain%22%3A%22BSC%22%2C%22rpc%22%3A%5B%22https%3A%2F%2F97.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22BNB+Chain+Native+Token%22%2C%22symbol%22%3A%22tBNB%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22bnbt%22%2C%22chainId%22%3A97%2C%22testnet%22%3Atrue%2C%22slug%22%3A%22binance-testnet%22%2C%22icon%22%3A%7B%22url%22%3A%22ipfs%3A%2F%2FQmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9%2Fbinance-coin%2F512.png%22%2C%22width%22%3A512%2C%22height%22%3A512%2C%22format%22%3A%22png%22%7D%7D&clientId=4e261cfb7bb5225ed35e4bcf3c9f1ebb&theme=dark&primaryColor=purple"
            width="100%"
            height="750px"
            style={{ maxWidth: "100%" }}
            frameBorder="0"
          ></iframe>
        </Box>
      </Flex>
    </div>
  );
}
