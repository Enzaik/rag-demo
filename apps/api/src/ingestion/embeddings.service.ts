import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;

@Injectable()
export class EmbeddingsService {
  private defaultClient: OpenAI | null = null;

  private getClient(apiKey?: string): OpenAI {
    if (apiKey) return new OpenAI({ apiKey });
    if (!this.defaultClient) {
      const envKey = process.env.OPENAI_API_KEY;
      if (!envKey) {
        throw new Error("OPENAI_API_KEY is not set and no per-request key was provided");
      }
      this.defaultClient = new OpenAI({ apiKey: envKey });
    }
    return this.defaultClient;
  }

  async embedBatch(inputs: string[], apiKey?: string): Promise<number[][]> {
    if (inputs.length === 0) return [];
    const res = await this.getClient(apiKey).embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs,
    });
    return res.data.map((d) => d.embedding);
  }

  async embedOne(input: string, apiKey?: string): Promise<number[]> {
    const [vec] = await this.embedBatch([input], apiKey);
    if (!vec || vec.length !== EMBEDDING_DIM) {
      throw new Error(`unexpected embedding dimension: ${vec?.length}`);
    }
    return vec;
  }
}
