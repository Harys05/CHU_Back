import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueService } from './historique.service';
import { HistoriqueController } from './historique.controller';
import { Historique } from './entities/historique.entity';
import { UploadService } from 'src/utils/upload_image';

@Module({
  imports: [TypeOrmModule.forFeature([Historique])],
  controllers: [HistoriqueController],
  providers: [HistoriqueService, UploadService],
  exports: [HistoriqueService, TypeOrmModule],
})
export class HistoriqueModule {}