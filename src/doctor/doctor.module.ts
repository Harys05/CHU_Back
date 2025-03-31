import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { UploadService } from 'src/utils/upload_image';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), 
  forwardRef(() => ScheduleModule)],
  controllers: [DoctorController],
  providers: [DoctorService, UploadService],
  exports: [DoctorService, TypeOrmModule],
})
export class DoctorModule {}