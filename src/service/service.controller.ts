import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Service } from './entities/service.entity';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: Service })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'List of all services', type: [Service] })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Service found', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get services by doctor ID' })
  @ApiResponse({ status: 200, description: 'List of services for the doctor', type: [Service] })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.serviceService.findByDoctor(+doctorId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}