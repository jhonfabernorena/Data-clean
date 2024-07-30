import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeyController } from "./apikey.controller";
import { ApiKeyService } from "../service/apiKey.service";
import { CreateApiKeyDto } from "../dtos/create-apy-key.dto";
import { InternalServerErrorException } from "@nestjs/common";

describe("ApiKeyController", () => {
  let controller: ApiKeyController;
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
  };

  const mockApiKeyService = {
    create: jest.fn().mockResolvedValue(mockApiKey),
    validateApiKey: jest.fn().mockResolvedValue(mockApiKey),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        {
          provide: ApiKeyService,
          useValue: mockApiKeyService,
        },
      ],
    }).compile();

    controller = module.get<ApiKeyController>(ApiKeyController);
    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new API key", async () => {
      const createApiKeyDto: CreateApiKeyDto = {
        apiKey: "testKey",
        limit: 100,
        usageCount: 0,
      };
      await expect(controller.create(createApiKeyDto)).resolves.toEqual(
        mockApiKey,
      );
      expect(service.create).toHaveBeenCalledWith(createApiKeyDto);
    });

    it("should handle InternalServerErrorException", async () => {
      jest
        .spyOn(service, "create")
        .mockRejectedValueOnce(new InternalServerErrorException());
      const createApiKeyDto: CreateApiKeyDto = {
        apiKey: "testKey",
        limit: 100,
        usageCount: 0,
      };
      await expect(controller.create(createApiKeyDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("validateApiKey", () => {
    it("should validate an API key", async () => {
      const apiKey = "testKey";
      await expect(controller.validateApiKey(apiKey)).resolves.toEqual(
        mockApiKey,
      );
      expect(service.validateApiKey).toHaveBeenCalledWith(apiKey);
    });

    it("should handle InternalServerErrorException", async () => {
      jest
        .spyOn(service, "validateApiKey")
        .mockRejectedValueOnce(new InternalServerErrorException());
      const apiKey = "invalidKey";
      await expect(controller.validateApiKey(apiKey)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
