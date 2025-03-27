import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Historique {
  @PrimaryGeneratedColumn()
  id_historique: number;

  @Column({ length: 255 })
  titre_historique: string;

  @Column('text')
  desc_historique: string;

  @Column('text', { nullable: true })
  photo_historique: string;
}