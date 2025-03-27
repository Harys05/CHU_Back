import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoriqueDto } from './dto/create-historique.dto';
import { UpdateHistoriqueDto } from './dto/update-historique.dto';
import { Historique } from './entities/historique.entity';

@Injectable()
export class HistoriqueService {
  constructor(
    @InjectRepository(Historique)
    private historiqueRepository: Repository<Historique>,
  ) {}

  create(createHistoriqueDto: CreateHistoriqueDto) {
    const historique = this.historiqueRepository.create(createHistoriqueDto);
    return this.historiqueRepository.save(historique);
  }

  findAll() {
    return this.historiqueRepository.find();
  }

  findOne(id: number) {
    return this.historiqueRepository.findOne({ where: { id_historique: id } });
  }

  update(id: number, updateHistoriqueDto: UpdateHistoriqueDto) {
    return this.historiqueRepository.update(id, updateHistoriqueDto);
  }

  remove(id: number) {
    return this.historiqueRepository.delete(id);
  }
}