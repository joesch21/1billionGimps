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
 * Below is the list of the BSC NFT contract supported by your marketplace
 */
export const NFT_CONTRACTS: NftContract[] = [
 
  {
    address: "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9",
    chain: bsc,
    title: "",
    thumbnailUrl:
      "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmNgLCDjfeKYEPnds2Ti3o7PJiupztadsFSVXZ8f35Jc7S/16.png",
    type: "ERC721",
  },
];
