import { UploadService } from './../utils/upload_image';
import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { Express } from 'express'; // Import Express type

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService, private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string', format: 'email' },
        telephone: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully', type: Patient })
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      if (!photo) {
        throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
      }

      // Validate DTO fields
      const { nom, age, email, telephone } = createPatientDto;
      if (!nom || !age || !email || !telephone) {
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      // Validate file type
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = photo.originalname.split('.').pop();
      if (!allowedExtensions.includes(extension)) {
        throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
      }

      // Save the file and update the DTO
      const fileName = await this.uploadService.saveFile(photo);
      createPatientDto.photo = `uploads/patients/${fileName}`;

      return await this.patientService.create(createPatientDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string', format: 'email' },
        telephone: { type: 'string' },
        photo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Patient updated successfully', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    try {
      // Validate file type if a new photo is provided
      if (photo) {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = photo.originalname.split('.').pop();
        if (!allowedExtensions.includes(extension)) {
          throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
        }

        // Save the file and update the DTO
        const fileName = await this.uploadService.saveFile(photo, 'patients');
        updatePatientDto.photo = `uploads/${fileName}`;
      }

      // Update all DTO fields
      const { nom, age, email, telephone } = updatePatientDto;
      if (nom !== undefined) {
        updatePatientDto.nom = nom;
      }
      if (age !== undefined) {
        updatePatientDto.age = age;
      }
      if (email !== undefined) {
        updatePatientDto.email = email;
      }
      if (telephone !== undefined) {
        updatePatientDto.telephone = telephone;
      }

      return await this.patientService.update(+id, updatePatientDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Utilisez le service upload_image.ts ici pour traiter le fichier
      const photoPath = `uploads/patients/${file.filename}`;
      return await this.patientService.update(+id, { photo: photoPath });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}