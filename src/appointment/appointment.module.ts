import { PatientService } from './../patient/patient.service';
import { DoctorService } from './../doctor/doctor.service';
import { forwardRef, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), DoctorModule, PatientModule, 
  forwardRef(() => ScheduleModule)],
  controllers: [AppointmentController],
  providers: [AppointmentService, DoctorService, PatientService],
})
export class AppointmentModule {}