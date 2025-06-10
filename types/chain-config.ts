import { Address, Chain } from "viem";

export type ChainConfig = {
  chain: Chain;
  contracts: {
    question: Address;
    questionManager: Address;
  };
};
