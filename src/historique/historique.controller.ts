import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { HistoriqueService } from './historique.service';
import { CreateHistoriqueDto } from './dto/create-historique.dto';
import { UpdateHistoriqueDto } from './dto/update-historique.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Historique } from './entities/historique.entity';
import { UploadService } from 'src/utils/upload_image';

@ApiTags('historiques')
@Controller('historiques')
export class HistoriqueController {
  constructor(
    private readonly historiqueService: HistoriqueService,
    private readonly uploadService : UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { 
      type:'object',
      properties : {
        description : {type : 'string' },
        photo : {type : 'string'}
      },
    },
  })
  @ApiOperation({ summary: 'Create a new historique entry' })
  @ApiResponse({ status: 201, description: 'Historique created successfully', type: Historique })
  async create(
    @Body() createHistoriqueDto: CreateHistoriqueDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      if (!photo){
        throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
      }

      const {description} = createHistoriqueDto;
      if (!description){
        throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
      }

      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = photo.originalname.split('.').pop();
      if (!allowedExtensions.includes(extension)) {
        throw new HttpException('Invalid file type. Allowed extensions are jpg, jpeg, png', HttpStatus.BAD_REQUEST);
      }

      // Save the file and update the DTO
      const fileName = await this.uploadService.saveFile(photo);
      createHistoriqueDto.photo = `uploads/patients/${fileName}`;

      return await this.historiqueService.create(createHistoriqueDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all historique entries' })
  @ApiResponse({ status: 200, description: 'List of all historiques', type: [Historique] })
  findAll() {
    return this.historiqueService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a historique by ID' })
  @ApiResponse({ status: 200, description: 'Historique found', type: Historique })
  @ApiResponse({ status: 404, description: 'Historique not found' })
  findOne(@Param('id') id: string) {
    return this.historiqueService.findOne(+id);
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
    @Body() updateHistoriqueDto : UpdateHistoriqueDto,
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
        updateHistoriqueDto.photo = `uploads/${fileName}`;

        const { description } = updateHistoriqueDto;
        if ( description != undefined){
          updateHistoriqueDto.description = description;
        }

        return await this.historiqueService.update(+id, updateHistoriqueDto);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a historique' })
  @ApiResponse({ status: 200, description: 'Historique deleted successfully' })
  @ApiResponse({ status: 404, description: 'Historique not found' })
  remove(@Param('id') id: string) {
    return this.historiqueService.remove(+id);
  }

  @Post(':id/upload-image')
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
      return await this.historiqueService.update(+id, { photo: photoPath });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}