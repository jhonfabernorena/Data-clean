import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeyService } from "./apiKey.service";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { ApiKey } from "../entities/apikey.entity";

describe("ApiKeyService", () => {
  let service: ApiKeyService;

  const mockApiKey = {
    _id: "someId",
    apiKey: "testKey",
    limit: 100,
    usageCount: 0,
    isActive: true,
    createdAt: null,
    createBy: null,
    updatedAt: null,
    updateBy: null,
    deletedAt: null,
    deleteBy: null,
    save: jest.fn().mockResolvedValue(this), // `this` hace referencia al objeto mockApiKey
  };

  const mockApiKeyModel = {
    create: jest.fn().mockResolvedValue(mockApiKey),
    findOne: jest.fn().mockResolvedValue(mockApiKey),
    find: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnThis(), // `.limit` debe devolver el objeto mockeado para encadenar `.exec()`
      exec: jest.fn().mockResolvedValue([mockApiKey]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: getModelToken(ApiKey.name),
          useValue: mockApiKeyModel,
        },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should validate an API key", async () => {
    const result = await service.validateApiKey("testKey");
    expect(result).toEqual(mockApiKey);
  });

  it("should throw NotFoundException if API key not found", async () => {
    jest.spyOn(mockApiKeyModel, "findOne").mockResolvedValueOnce(null);
    await expect(service.validateApiKey("invalidKey")).rejects.toThrow(
      NotFoundException,
    );
  });
});
