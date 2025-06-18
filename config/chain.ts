import { ChainConfig } from "@/types/chain-config";
import { lukso, luksoTestnet } from "viem/chains";

const chainConfigTestnet: ChainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0xCd0A759BdD491355E6d6Fdd6c83c2198a5Dcc299",
    questionManager: "0xd16b351c93f802135e34E065B53E5af400519bb0",
  },
};

const chainConfigMainnet: ChainConfig = {
  chain: lukso,
  contracts: {
    question: "0x0000000000000000000000000000000000000000",
    questionManager: "0x0000000000000000000000000000000000000000",
  },
};

export const chainConfig =
  process.env.NEXT_PUBLIC_CHAIN === "testnet"
    ? chainConfigTestnet
    : chainConfigMainnet;
