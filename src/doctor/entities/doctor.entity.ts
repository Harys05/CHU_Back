import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  specialization: string;

  @Column({ length: 255 })
  phone: string;

  @Column({ length: 255 })
  email: string;
}