import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Schedule } from './entities/schedule.entity';

@ApiBearerAuth()
@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new schedule slot',
    description: 'Create a new time slot for a doctor',
  })
  @ApiBody({ type: CreateScheduleDto })
  @ApiCreatedResponse({
    description: 'The schedule has been successfully created.',
    type: Schedule,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Doctor not found',
  })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all schedules',
    description: 'Retrieve a list of all schedule slots',
  })
  @ApiOkResponse({
    description: 'List of all schedules',
    type: [Schedule],
  })
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a schedule by ID',
    description: 'Retrieve a specific schedule slot by its ID',
  })
  @ApiParam({ name: 'id', description: 'Schedule ID', type: Number })
  @ApiOkResponse({
    description: 'Schedule found',
    type: Schedule,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found',
  })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({
    summary: 'Get schedules by doctor ID',
    description: 'Retrieve all schedule slots for a specific doctor',
  })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID', type: Number })
  @ApiOkResponse({
    description: 'List of schedules for the doctor',
    type: [Schedule],
  })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.scheduleService.findByDoctor(+doctorId);
  }

  @Get('available/:doctorId')
  @ApiOperation({
    summary: 'Get available slots for a doctor',
    description: 'Retrieve available time slots for a doctor on a specific date',
  })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID', type: Number })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date to check availability (YYYY-MM-DD format)',
    example: '2023-12-31',
  })
  @ApiOkResponse({
    description: 'List of available schedules',
    type: [Schedule],
  })
  findAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.scheduleService.findAvailableSlots(+doctorId, new Date(date));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a schedule',
    description: 'Update an existing schedule slot',
  })
  @ApiParam({ name: 'id', description: 'Schedule ID to update', type: Number })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiOkResponse({
    description: 'Schedule updated successfully',
    type: Schedule,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a schedule',
    description: 'Remove a schedule slot',
  })
  @ApiParam({ name: 'id', description: 'Schedule ID to delete', type: Number })
  @ApiOkResponse({ description: 'Schedule deleted successfully' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Schedule not found',
  })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}