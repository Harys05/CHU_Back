import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Doctor } from './entities/doctor.entity';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created successfully', type: Doctor })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of all doctors', type: [Doctor] })
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Doctor found', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }

  @Post(':id/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // Utilisez le service upload_image.ts ici pour traiter le fichier
    const photoPath = `uploads/doctors/${file.filename}`;
    return this.doctorService.update(+id, { photo: photoPath });
  }
}