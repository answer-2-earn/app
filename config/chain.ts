import { Address } from "viem";
import { lukso, luksoTestnet } from "viem/chains";

const chainConfigMainnet = {
  chain: lukso,
  contracts: {
    question: "0x0000000000000000000000000000000000000000" as Address,
    questionManager: "0x0000000000000000000000000000000000000000" as Address,
  },
};

const chainConfigTestnet = {
  chain: luksoTestnet,
  contracts: {
    question: "0xA958c128203d2671636f8820E943640A097e6A60" as Address,
    questionManager: "0xEDe254159220fEE61bC83FDa5A9f1EA5b510472e" as Address,
  },
};

export const chainConfig =
  process.env.NEXT_PUBLIC_CHAIN === "testnet"
    ? chainConfigTestnet
    : chainConfigMainnet;
