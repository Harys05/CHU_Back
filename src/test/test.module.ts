import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { UploadService } from '../utils/upload_image';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService, UploadService],
})
export class TestModule {}
