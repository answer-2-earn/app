export type QuestionMetadata = {
  LSP4Metadata: {
    name: string;
    description: string;
    links: QuestionMetadataLink[];
    icon: [];
    images: QuestionMetadataImage[][];
    assets: [];
    attributes: QuestionMetadataAttribute[];
  };
};

export type QuestionMetadataLink = {
  title: string;
  url: string;
};

export type QuestionMetadataImage = {
  width: number;
  height: number;
  url: string;
};

export type QuestionMetadataAttribute = {
  key: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean";
};
