import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, HttpException, HttpStatus, UploadedFile, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/utils/upload_image';
import  { Event } from './entities/event.entity';
import { Express } from 'express';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties:{
        title:{type : 'string'},
        description:{type : 'string'},
        date:{type : 'string'},
        location:{type : 'string'},
        photo:{type : 'string'}
      },
    },
  })
  @ApiOperation({ summary : 'Create a new event'})
  @ApiResponse({ status : 201, description : 'Successfull creation', type : Event})
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      if (!photo){
        throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
      }

      const {title, description, date, location} = createEventDto;
      if (!title || !description || !date || !location){
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = photo.originalname.split('.').pop();
      if (!allowedExtensions.includes(extension)) {
        throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
      }

      // Save the file and update the DTO
      const fileName = await this.uploadService.saveFile(photo);
      createEventDto.photo = `uploads/patients/${fileName}`;

      return await this.eventService.create(createEventDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events.' })
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties:{
        title:{type : 'string'},
        description:{type : 'string'},
        date:{type : 'string'},
        location:{type : 'string'},
        photo:{type : 'string'}
      },
    },
  })
  @ApiResponse({ status : 200, description: 'Event updated successfully', type: Event})
  @ApiResponse({ status: 404, description : 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto : UpdateEventDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    try {
      if (photo) {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = photo.originalname.split('.').pop();
        if (!allowedExtensions.includes(extension)) {
          throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
        }

        // Save the file and update the DTO
        const fileName = await this.uploadService.saveFile(photo, 'patients');
        updateEventDto.photo = `uploads/${fileName}`;

        const { title, description, date, location } = updateEventDto;
        if ( title != undefined){
          updateEventDto.title = title;
        }
        if ( description != undefined){
          updateEventDto.description = description;
        }
        if ( date != undefined){
          updateEventDto.date = date;
        }
        if ( location != undefined){
          updateEventDto.location = location;
        }

        return await this.eventService.update(+id, updateEventDto);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiResponse({ status: 200, description: 'The event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
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
      return await this.eventService.update(+id, { photo: photoPath });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}