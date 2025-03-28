import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historique } from './entities/historique.entity';
import { CreateHistoriqueDto } from './dto/create-historique.dto';
import { UpdateHistoriqueDto } from './dto/update-historique.dto';

@Injectable()
export class HistoriqueService {
  constructor(
    @InjectRepository(Historique)
    private historiqueRepository: Repository<Historique>,
  ) {}

  async create(createHistoriqueDto: CreateHistoriqueDto): Promise<Historique> {
    const historique = this.historiqueRepository.create(createHistoriqueDto);
    return this.historiqueRepository.save(historique);
  }

  async findAll(): Promise<Historique[]> {
    return this.historiqueRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Historique> {
    const historique = await this.historiqueRepository.findOne({ where: { id } });
    if (!historique) {
      throw new NotFoundException(`Historique with ID ${id} not found`);
    }
    return historique;
  }

  async update(id: number, updateHistoriqueDto: UpdateHistoriqueDto): Promise<Historique> {
    const historique = await this.findOne(id);
    this.historiqueRepository.merge(historique, updateHistoriqueDto);
    return this.historiqueRepository.save(historique);
  }

  async remove(id: number): Promise<void> {
    const historique = await this.findOne(id);
    await this.historiqueRepository.remove(historique);
  }
}