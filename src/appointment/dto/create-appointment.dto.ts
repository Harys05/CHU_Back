import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  heure: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ required: false, default: 'planifié' })
  @IsString()
  statut?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_doctor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_patient: number;
}