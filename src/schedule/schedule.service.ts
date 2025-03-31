import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private doctorService: DoctorService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const doctor = await this.doctorService.findOne(createScheduleDto.doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      doctor,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ relations: ['doctor'] });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);
    Object.assign(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
  }

  async findByDoctor(doctorId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['doctor'],
    });
  }

  async findAvailableSlots(doctorId: number, date: Date): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: {
        doctor: { id: doctorId },
        day: date,
        isAvailable: true,
      },
      relations: ['doctor'],
    });
  }
}