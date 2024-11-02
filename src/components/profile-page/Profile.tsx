import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { shortenAddress } from "thirdweb/utils";
import { ProfileMenu } from "./Menu";
import { useEffect, useState } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { OwnedItem } from "./OwnedItem";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { Link } from "@chakra-ui/next-js";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useGetENSName } from "@/hooks/useGetENSName";

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const [nftAvatar, setNftAvatar] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );

  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  const {
    data,
    error,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    }
  );

  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;
  if (!marketplaceContractAddress) throw Error("No marketplace contract found");
  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });
  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: { enabled: data && data.length > 0 },
    });
  const listings = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            contract.address.toLowerCase() &&
          item.creatorAddress.toLowerCase() === address.toLowerCase()
      )
    : [];
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 2, xl: 4 });

  // Updated fetchNftAvatar function
  async function fetchNftAvatar() {
    try {
      const selectedCollection = NFT_CONTRACTS[0];
      const contract = getContract({
        address: selectedCollection.address,
        chain: selectedCollection.chain,
        client,
      });

      const ownedNfts = await getOwnedERC721s({ contract, owner: address });

      // Ensure that `metadata` and `image` exist before setting the avatar
      if (
        ownedNfts &&
        ownedNfts.length > 0 &&
        ownedNfts[0]?.metadata?.image
      ) {
        setNftAvatar(ownedNfts[0].metadata.image as string); // Set the first NFT image as avatar
      }
    } catch (error) {
      console.error("Error fetching NFTs for avatar:", error);
    }
  }

  // Call fetchNftAvatar on component mount
  useEffect(() => {
    fetchNftAvatar();
  }, [address]);

  return (
    <Box px={{ lg: "50px", base: "20px" }}>
      <Flex direction={{ lg: "row", md: "column", sm: "column" }} gap={5}>
        <Box position="relative" w={{ lg: 150, base: 100 }} h={{ lg: 150, base: 100 }}>
          {/* Frame background image */}
          <Img src="/images/4.png" alt="Frame" position="absolute" top={0} left={0} w="100%" h="100%" />
          {/* NFT avatar image */}
          <Img
            src={nftAvatar ?? "/images/Image.png"} // Set the default image if nftAvatar is not available
            alt="NFT Avatar"
            rounded="8px"
            position="absolute"
            top="20%"
            left="20%"
            w="60%"
            h="60%"
          />
        </Box>
        <Box my="auto">
          <Heading>{ensName ?? ""}</Heading>
          <Text color="gray">{shortenAddress(address)}</Text>
        </Box>
      </Flex>

      <Flex direction={{ lg: "row", base: "column" }} gap="10" mt="20px">
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        {isLoadingOwnedNFTs ? (
          <Box>
            <Text>Loading...</Text>
          </Box>
        ) : (
          <Box>
            <Flex direction="row" justifyContent="space-between" px="12px">
              <Tabs
                variant="soft-rounded"
                onChange={(index) => setTabIndex(index)}
                isLazy
                defaultIndex={0}
              >
                <TabList>
                  <Tab>Owned ({data?.length})</Tab>
                  <Tab>Listings ({listings.length || 0})</Tab>
                </TabList>
              </Tabs>
              <Link
                href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                color="gray"
              >
                View collection <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
            <SimpleGrid columns={columns} spacing={4} p={4}>
              {tabIndex === 0 ? (
                <>
                  {data && data.length > 0 ? (
                    data?.map((item) => (
                      <OwnedItem
                        key={item.id.toString()}
                        nftCollection={contract}
                        nft={item}
                      />
                    ))
                  ) : (
                    <Box>
                      <Text>
                        {isYou ? "You" : ensName ? ensName : shortenAddress(address)}{" "}
                        {isYou ? "do" : "does"} not own any NFT in this collection
                      </Text>
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {listings && listings.length > 0 ? (
                    listings?.map((item) => (
                      <Box
                        key={item.id}
                        rounded="12px"
                        as={Link}
                        href={`/collection/${contract.chain.id}/${contract.address}/token/${item.asset.id.toString()}`}
                        _hover={{ textDecoration: "none" }}
                        w={250}
                      >
                        <Flex direction="column">
                          <MediaRenderer
                            client={client}
                            src={item.asset.metadata.image}
                          />
                          <Text mt="12px">
                            {item.asset?.metadata?.name ?? "Unknown item"}
                          </Text>
                          <Text>Price</Text>
                          <Text>
                            {toEther(item.pricePerToken)}{" "}
                            {item.currencyValuePerToken.symbol}
                          </Text>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Box>
                      You do not have any listing with this collection
                    </Box>
                  )}
                </>
              )}
            </SimpleGrid>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
