import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  heure: Date;

  @Column()
  type: string;

  @Column({ default: 'planifié' })
  statut: string;

  @ManyToOne(() => Doctor, doctor => doctor.appointment)
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @ManyToOne(() => Patient, patient => patient.appointment)
  @JoinColumn({ name: 'id_patient' })
  patient: Patient;
}