import type { Chain } from "thirdweb";
import { bscTestnet } from "./chains";

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "0xBE937F713885768F0F903E62c0f5DD187b24915C",
    chain: bscTestnet,
  }
];
