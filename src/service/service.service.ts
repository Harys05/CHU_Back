import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private readonly doctorService: DoctorService,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const doctor = await this.doctorService.findOne(createServiceDto.doctorId);
    const service = this.serviceRepository.create({
      ...createServiceDto,
      doctor,
    });
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({ relations: ['doctor'] });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ 
      where: { id },
      relations: ['doctor'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    if (updateServiceDto.doctorId) {
      const doctor = await this.doctorService.findOne(updateServiceDto.doctorId);
      service.doctor = doctor;
    }
    this.serviceRepository.merge(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async findByDoctor(doctorId: number): Promise<Service[]> {
    return this.serviceRepository.find({ 
      where: { doctor: { id: doctorId } },
      relations: ['doctor'],
    });
  }
}