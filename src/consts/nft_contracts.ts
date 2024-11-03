import type { Chain } from "thirdweb";
import { bscTestnet } from "./chains";

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
 * Below is the list of the BSC NFT contract supported by your marketplace
 */
export const NFT_CONTRACTS: NftContract[] = [
 
  {
    address: "0x36cda97E72911E85781486a5C182baeC87071d20",
    chain: bscTestnet,
    title: "",
    thumbnailUrl:
      "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmNgLCDjfeKYEPnds2Ti3o7PJiupztadsFSVXZ8f35Jc7S/16.png",
    type: "ERC721",
  },
];

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = "https://bscTestnetcscan.com"