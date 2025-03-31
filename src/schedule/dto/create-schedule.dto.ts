import { IsDate, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'ID of the doctor',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @ApiProperty({
    description: 'Date of the schedule (YYYY-MM-DD format)',
    example: '2023-12-31',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  day: Date;

  @ApiProperty({
    description: 'Start time of the slot (HH:MM format)',
    example: '09:00',
    type: String,
  })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot (HH:MM format)',
    example: '10:00',
    type: String,
  })
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Whether the slot is available',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  isAvailable: boolean = true;
}