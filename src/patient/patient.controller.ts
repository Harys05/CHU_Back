import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully', type: Patient })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of all patients', type: [Patient] })
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient found', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
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
    const photoPath = `uploads/patients/${file.filename}`;
    return this.patientService.update(+id, { photo: photoPath });
  }
}