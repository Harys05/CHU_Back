import { Doctor } from "src/doctor/entities/doctor.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Doctor, doctor => doctor.services)
  doctor: Doctor;
}