import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { TestModule } from './test/test.module';
import { HistoriqueModule } from './historique/historique.module';
import { EventModule } from './event/event.module';
import { DoctorModule } from './doctor/doctor.module';
import { ServiceModule } from './service/service.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        CORS_ORIGINS: Joi.string(),
      }),
    }),
    DatabaseModule,
    TestModule,
    HistoriqueModule,
    EventModule,
    DoctorModule,
    ServiceModule,
    PatientModule,
    AppointmentModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
