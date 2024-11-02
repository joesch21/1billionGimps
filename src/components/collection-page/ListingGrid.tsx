import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";

// IDs to exclude
const excludeIds = ["0", "1", "2", "3"]; // Adjust as needed for token IDs or image names

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 4),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });
  
  if (!listingsInSelectedCollection || !len) return <></>;

  // Filter out excluded IDs
  const filteredListings = listingsInSelectedCollection.filter(
    (item) => !excludeIds.includes(item.asset.id.toString())
  );

  return (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {filteredListings.map((item) => (
        <Box
          key={item.id}
          rounded="12px"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}
          _hover={{ textDecoration: "none" }}
        >
          <Flex direction="column">
            <MediaRenderer client={client} src={item.asset.metadata.image} />
            <Text>{item.asset?.metadata?.name ?? "Unknown item"}</Text>
            <Text>Price</Text>
            <Text>
              {item.currencyValuePerToken.displayValue} {item.currencyValuePerToken.symbol}
            </Text>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
}
