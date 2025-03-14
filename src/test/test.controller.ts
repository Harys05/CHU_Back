import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Put,
  Delete,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation, ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

@Controller('test')
@ApiTags('Test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau Test' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Données du test et fichier',
    required: true,
    schema: {
      type: 'object',
      properties: {
        nom_test: { type: 'string', example: 'Exemple' },
        fichier: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['nom_test', 'fichier'],
    },
  })
  @ApiResponse({ status: 201, description: 'Le Test a été créé avec succès.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  @ApiResponse({ status: 409, description: 'Conflit: le Test existe déjà.' })
  @UseInterceptors(FileInterceptor('fichier'))
  async createTest(
    @Body() body: CreateTestDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.testService.createTest({ ...body, file });
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les tests' })
  @ApiResponse({ status: 200, description: 'La liste des tests.' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un test par ID' })
  @ApiResponse({ status: 200, description: 'Les détails du test.' })
  @ApiResponse({ status: 404, description: 'Test non trouvé.' })
  async findOne(@Param('id') id: string) {
    return this.testService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un test par ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Données du test et fichier',
    required: true,
    schema: {
      type: 'object',
      properties: {
        nom_test: { type: 'string', example: 'Exemple' },
        fichier: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Le test a été mis à jour avec succès.',
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  @UseInterceptors(FileInterceptor('fichier'))
  async updateTest(
    @Param('id') id: string,
    @Body() body: Partial<CreateTestDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.testService.updateTest(id, { ...body, file });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un test par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le test a été supprimé avec succès.',
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async deleteTest(@Param('id') id: string) {
    return this.testService.deleteTest(id);
  }

}
