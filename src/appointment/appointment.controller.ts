import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully', type: Appointment })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'List of all appointments', type: [Appointment] })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment found', type: Appointment })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id/statut/:statut')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({ status: 200, description: 'Appointment status updated', type: Appointment })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  updateStatut(@Param('id') id: string, @Param('statut') statut: string) {
    return this.appointmentService.updateStatut(+id, statut);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}