import { questionAbi } from "@/abi/question";
import { questionManagerAbi } from "@/abi/question-manager";
import { chainConfig } from "@/config/chain";
import { siteConfig } from "@/config/site";
import { pinataIpfsToHttp } from "@/lib/ipfs";
import { QuestionAnswerMetadata } from "@/types/question-answer-metadata";
import { QuestionMetadata } from "@/types/question-metadata";
import ERC725 from "@erc725/erc725.js";
import axios from "axios";
import { createPublicClient, Hex, http } from "viem";

export function createQuestionMetadata(
  asker: `0x${string}`,
  question: string,
  reward: string,
  answerer: `0x${string}`
): QuestionMetadata {
  return {
    LSP4Metadata: {
      name: "Question Token",
      description: "A token issued by the Answer 2 Earn project.",
      links: [
        {
          title: "Website",
          url: siteConfig.links.website,
        },
      ],
      icon: [],
      images: [
        [
          {
            width: 512,
            height: 512,
            url: "ipfs://bafkreiedefseafrpqw6kkq2sryaayhd5hcxsfebmlwwxpfpgc7vmsqkgbm",
          },
        ],
      ],
      assets: [],
      attributes: [
        {
          key: "Asker",
          value: asker,
          type: "string",
        },
        {
          key: "Question",
          value: question,
          type: "string",
        },
        {
          key: "Question Date",
          value: new Date().getTime(),
          type: "number",
        },
        {
          key: "Reward",
          value: reward,
          type: "string",
        },
        {
          key: "Answerer",
          value: answerer,
          type: "string",
        },
      ],
    },
  };
}

export async function getQuestionMetadata(
  questionId: Hex
): Promise<QuestionMetadata> {
  // Load metadata value from the contract
  const publicClient = createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  });
  const metadataValue = await publicClient.readContract({
    address: chainConfig.contracts.question,
    abi: questionAbi,
    functionName: "getDataForTokenId",
    args: [
      questionId,
      "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
    ],
  });

  // Decode metadata value to get the metadata URL
  const schema = [
    {
      name: "LSP4Metadata",
      key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const decodedMetadataValue = erc725.decodeData([
    {
      keyName: "LSP4Metadata",
      value: metadataValue,
    },
  ]);
  const metadataValueUrl = decodedMetadataValue[0]?.value?.url;

  // Define metadata HTTP URL
  const metadataHttpUrl = pinataIpfsToHttp(metadataValueUrl);
  if (!metadataHttpUrl) {
    throw new Error("Invalid metadata HTTP URL");
  }

  // Load metadata from IPFS
  const { data } = await axios.get(metadataHttpUrl);

  return data as QuestionMetadata;
}

export async function getQuestionAnswerMetadata(
  questionId: Hex
): Promise<QuestionAnswerMetadata> {
  // Load metadata value from the contract
  const publicClient = createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  });
  const metadataValue = await publicClient.readContract({
    address: chainConfig.contracts.questionManager,
    abi: questionManagerAbi,
    functionName: "getAnswer",
    args: [questionId],
  });

  // Decode metadata value to get the metadata URL
  const schema = [
    {
      name: "LSP4Metadata",
      key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const decodedMetadataValue = erc725.decodeData([
    {
      keyName: "LSP4Metadata",
      value: metadataValue,
    },
  ]);
  const metadataValueUrl = decodedMetadataValue[0]?.value?.url;

  // Define metadata HTTP URL
  const metadataHttpUrl = pinataIpfsToHttp(metadataValueUrl);
  if (!metadataHttpUrl) {
    return { answer: "", answerDate: 0 };
  }

  // Load metadata from IPFS
  const { data } = await axios.get(metadataHttpUrl);

  return data as QuestionAnswerMetadata;
}

export function getEncodedMetadataValue(
  metadata: QuestionMetadata | QuestionAnswerMetadata,
  url: string
): Hex {
  const schema = [
    {
      name: "LSP4Metadata",
      key: "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e",
      keyType: "Singleton",
      valueType: "bytes",
      valueContent: "VerifiableURI",
    },
  ];
  const erc725 = new ERC725(schema);
  const encodedMetadata = erc725.encodeData([
    {
      keyName: "LSP4Metadata",
      value: {
        json: metadata,
        url: url,
      },
    },
  ]);
  return encodedMetadata.values[0] as Hex;
}
