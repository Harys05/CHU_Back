import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { Repository } from 'typeorm';
import { UploadService } from '../utils/upload_image';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    private readonly uploadService: UploadService,
  ) {}

  async createTest(dto: CreateTestDto): Promise<Test> {
    const path_file = this.uploadService.saveFile(dto.file);
    const test = this.testRepository.create({ nom_test: dto.nom_test, path_file });
    return this.testRepository.save(test);
  }

  async findAll(): Promise<Test[]> {
    return this.testRepository.find();
  }

  async findOne(id: string): Promise<Test> {
    return this.testRepository.findOne({ where: { id_test: id } });
  }

  async updateTest(id: string, dto: Partial<CreateTestDto>): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id_test: id } });
    if (!test) throw new Error('Test not found');

    if (dto.file) {
      test.path_file = this.uploadService.saveFile(dto.file);
    }
    if (dto.nom_test) {
      test.nom_test = dto.nom_test;
    }
    return this.testRepository.save(test);
  }

  async deleteTest(id: string): Promise<void> {
    await this.testRepository.delete(id);
  }


  async previewImage(id: string): Promise<Buffer> {
    const testing = await this.testRepository.findOne({ where: { id_test: id } });
    if (!testing) {
      throw new HttpException('test non rencontré', HttpStatus.NOT_FOUND);
    }
    const previewFilename = await this.uploadService.generatePreview(testing.path_file);
    return this.uploadService.readFile(previewFilename);
  }
}