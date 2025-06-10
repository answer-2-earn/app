import { ChainConfig } from "@/types/chain-config";
import { lukso, luksoTestnet } from "viem/chains";

const chainConfigMainnet: ChainConfig = {
  chain: lukso,
  contracts: {
    question: "0x0000000000000000000000000000000000000000",
    questionManager: "0x0000000000000000000000000000000000000000",
  },
};

const chainConfigTestnet: ChainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0xA958c128203d2671636f8820E943640A097e6A60",
    questionManager: "0xEDe254159220fEE61bC83FDa5A9f1EA5b510472e",
  },
};

export const chainConfig =
  process.env.NEXT_PUBLIC_CHAIN === "testnet"
    ? chainConfigTestnet
    : chainConfigMainnet;
