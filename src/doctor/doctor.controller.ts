import { UploadService } from './../utils/upload_image';
import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Doctor } from './entities/doctor.entity';
import { Express } from 'express'; // Import Express type

@ApiTags('doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService, private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' , example: 'Dr. John Doe' },
        specialization: { type: 'string', example: 'Cardiologist' },
        phone: { type: 'string', example: '1234567890' },
        email: { type: 'string' , example: '2L5yj@example.com' },
        photo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created successfully', type: Doctor })
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      if (!photo) {
        throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
      }

      // Validate DTO fields
      const {name, specialization, phone, email} = createDoctorDto;
      if (!name || !specialization || !phone || !email) {
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      // Validate file type
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = photo.originalname.split('.').pop();
      if (!allowedExtensions.includes(extension)) {
        throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
      }

      // Save the file and update the DTO
      const fileName = await this.uploadService.saveFile(photo, 'doctors');
      createDoctorDto.photo = `uploads/doctors/${fileName}`;

      return await this.doctorService.create(createDoctorDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Dr. John Doe' },
        specialization: { type: 'string', example: 'Cardiologist' },
        phone: { type: 'string', example: '1234567890' },
        email: { type: 'string' , example: 'hIg8U@example.com' },
        photo: { type: 'string', format: 'binary'},
      },
    },
  })
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
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
        const fileName = await this.uploadService.saveFile(photo, 'doctors');
        updateDoctorDto.photo = `uploads/doctors/${fileName}`;
      }

      // Update the doctor
      const {name, specialization, phone, email} = updateDoctorDto;
      if (name !== undefined) {
        updateDoctorDto.name = name;
      }
      if (specialization !== undefined) {
        updateDoctorDto.specialization = specialization;
      }
      if (phone !== undefined) {
        updateDoctorDto.phone = phone;
      }
      if (email !== undefined) {
        updateDoctorDto.email = email;
      }

      return await this.doctorService.update(+id, updateDoctorDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Utilisez le service upload_image.ts ici pour traiter le fichier
      const photoPath = `uploads/doctors/${file.filename}`;
      return await this.doctorService.update(+id, { photo: photoPath });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}