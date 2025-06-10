export type QuestionMetadata = {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: QuestionMetadataAttribute[];
};

export type QuestionMetadataAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};
