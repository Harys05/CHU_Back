import { IsDate, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'New date for the schedule (YYYY-MM-DD format)',
    example: '2023-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  day?: Date;

  @ApiProperty({
    description: 'New start time (HH:MM format)',
    example: '10:00',
    required: false,
    type: String,
  })
  @IsOptional()
  startTime?: string;

  @ApiProperty({
    description: 'New end time (HH:MM format)',
    example: '11:00',
    required: false,
    type: String,
  })
  @IsOptional()
  endTime?: string;

  @ApiProperty({
    description: 'Update availability status',
    example: false,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}