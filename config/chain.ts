import { ChainConfig } from "@/types/chain-config";
import { lukso, luksoTestnet } from "viem/chains";

const chainConfigTestnet: ChainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0x0E8677B7E1d529a3c5CdCd17D79013A085625cC0",
    questionManager: "0xEeD3a236ba83E91f357C2c348384CbB91b331AD7",
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
