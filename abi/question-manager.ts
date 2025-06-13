export const questionManagerAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadataValue",
        type: "bytes",
      },
    ],
    name: "QuestionAnswered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadataValue",
        type: "bytes",
      },
    ],
    name: "QuestionAsked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "QuestionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum QuestionManager.QuestionProcessingStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "QuestionProcessed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "metadataValue",
        type: "bytes",
      },
    ],
    name: "answer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "metadataValue",
        type: "bytes",
      },
    ],
    name: "ask",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "askers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "getAsker",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "getProcessingStatus",
    outputs: [
      {
        internalType: "enum QuestionManager.QuestionProcessingStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "getReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "questionAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "validatorAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "processInvalidAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "processValidAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "processingStatuses",
    outputs: [
      {
        internalType: "enum QuestionManager.QuestionProcessingStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "question",
    outputs: [
      {
        internalType: "contract Question",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tokenId",
        type: "bytes32",
      },
    ],
    name: "rewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferQuestionOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "validator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
