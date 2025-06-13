import { ChainConfig } from "@/types/chain-config";
import { lukso, luksoTestnet } from "viem/chains";

const chainConfigTestnet: ChainConfig = {
  chain: luksoTestnet,
  contracts: {
    question: "0x9B0A7945cae625db7C4f929bF00f74B2E807330d",
    questionManager: "0x5775e553Cb55844A068E1B78fD46AE1cF587AF20",
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
