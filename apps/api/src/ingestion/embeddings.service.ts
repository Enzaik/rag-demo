import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;

@Injectable()
export class EmbeddingsService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    this.client = new OpenAI({ apiKey });
  }

  async embedBatch(inputs: string[]): Promise<number[][]> {
    if (inputs.length === 0) return [];
    const res = await this.client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs,
    });
    return res.data.map((d) => d.embedding);
  }

  async embedOne(input: string): Promise<number[]> {
    const [vec] = await this.embedBatch([input]);
    if (!vec || vec.length !== EMBEDDING_DIM) {
      throw new Error(`unexpected embedding dimension: ${vec?.length}`);
    }
    return vec;
  }
}
