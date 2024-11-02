import type { Chain } from "thirdweb";
import { bsc } from "./chains";

export type Token = {
  tokenAddress: string;
  symbol: string;
  icon: string;
};

export type SupportedTokens = {
  chain: Chain;
  tokens: Token[];
};

/**
 * SUPPORTED_TOKENS:
 * By default, listings use the native token of the network (e.g., BNB, ETH, MATIC).
 * 
 * This configuration allows for additional ERC20 tokens to be used as payment options.
 * Make sure the marketplace contract on the specified chain supports these tokens.
 * 
 * You can check your marketplace's permissions at:
 * https://thirdweb.com/<chain-id>/<marketplace-v3-address>/permissions -> Asset
 */
export const SUPPORTED_TOKENS: SupportedTokens[] = [
  {
    chain: bsc,
    tokens: [
      {
        tokenAddress: "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A",
        symbol: "GCC",
        icon: "/erc20-icons/logo.png",
      },
     
    ],
  },

  

  
];

/**
 * NATIVE_TOKEN_ICON_MAP:
 * A mapping from Chain ID to the icon URL for the native token.
 * This ensures the correct icon is displayed for each chain's native token.
 */
export const NATIVE_TOKEN_ICON_MAP: { [key in Chain["id"]]: string } = {
  1: "/native-token-icons/GCC.png",
  [bsc.id]: "/native-token-icons/bsc.png",
  
};
