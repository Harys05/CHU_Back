import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateEventDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location

  @ApiProperty({ required : false})
  photo?: string;
}