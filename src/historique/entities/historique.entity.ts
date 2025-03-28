import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Historique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}