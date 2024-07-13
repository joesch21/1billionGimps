import type { Chain } from "thirdweb";
import { bsc } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This is of course hard-coded for demo purpose
 *
 * In reality, the list should be dynamically fetched from your own data source
 */
export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0xF09334a9027b263096b772b0F46D271E90b53F3E",
    chain: bsc,
    title: "",
    thumbnailUrl:
      "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmNgLCDjfeKYEPnds2Ti3o7PJiupztadsFSVXZ8f35Jc7S/16.png",
    type: "ERC721",
  },
];
