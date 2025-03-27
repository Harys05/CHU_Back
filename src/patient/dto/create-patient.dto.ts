import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber, IsInt, Min } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('FR')
  telephone: string;

  @ApiProperty({ required: false })
  photo?: string;
}