import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateApiKeyDto } from "../dtos/create-apy-key.dto";
import { ApiKey } from "../entities/apikey.entity";

@Injectable()
export class ApiKeyService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>) {}

  async create(CreateApiKeyDto: CreateApiKeyDto) {
    const newApiKey = new this.apiKeyModel(CreateApiKeyDto);
    return await newApiKey.save();
  }

  async validateApiKey(apiKey: string) {
    const apiKeyData = await this.apiKeyModel.findOne({ apiKey });
    if (!apiKeyData) {
      throw new NotFoundException("API key not found");
    }
    return apiKeyData;
  }

  async getApiKeys(limit: number) {
    const apiKeyData = await this.apiKeyModel.find().limit(limit);
    if (!apiKeyData) {
      throw new NotFoundException("API key not found");
    }
    return apiKeyData;
  }
}
