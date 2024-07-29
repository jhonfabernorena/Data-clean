import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiQuery,
  ApiHeader,
} from "@nestjs/swagger";
import { ApiKeyService } from "../service/apiKey.service";
import { CreateApiKeyDto } from "../dtos/create-apy-key.dto";
import { validateKeyDto } from "../dtos/validatekey.dto";

@ApiTags("Key Subscriptions")
@Controller("key-subscription")
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post("new")
  @ApiHeader({
    name: "x-api-key",
    description: "API key needed to access this endpoint",
  })
  @ApiOperation({ summary: "Create a new API key" })
  @ApiBody({ type: CreateApiKeyDto })
  @ApiResponse({
    status: 201,
    description: "The API key has been successfully created.",
  })
  @ApiBadRequestResponse({ description: "Invalid data provided." })
  @ApiInternalServerErrorResponse({ description: "Internal server error." })
  async create(@Body() CreateApiKeyDto: CreateApiKeyDto) {
    try {
      return await this.apiKeyService.create(CreateApiKeyDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post("validate")
  @ApiHeader({
    name: "x-api-key",
    description: "API key needed to access this endpoint",
  })
  @ApiBody({
    type: validateKeyDto,
  })
  @ApiOperation({ summary: "Validate an API key" })
  @ApiResponse({ status: 201, description: "Validation successful." })
  @ApiBadRequestResponse({ description: "Invalid API key provided." })
  @ApiInternalServerErrorResponse({ description: "Internal server error." })
  async validateApiKey(@Body("apiKey") apiKey: string) {
    try {
      return await this.apiKeyService.validateApiKey(apiKey);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("keys")
  @ApiHeader({
    name: "x-api-key",
    description: "API key needed to access this endpoint",
  })
  @ApiOperation({ summary: "Get API keys by type and limit" })
  @ApiQuery({ name: "limit", type: Number, required: true })
  @ApiResponse({ status: 200, description: "API keys retrieved successfully." })
  @ApiBadRequestResponse({ description: "Invalid query parameters provided." })
  @ApiInternalServerErrorResponse({ description: "Internal server error." })
  async getApiKeys(@Query("limit") limit: number, @Query("type") type: string) {
    try {
      return await this.apiKeyService.getApiKeys(limit, type);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
