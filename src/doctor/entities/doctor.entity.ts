import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  specialization: string;
l
  @Column({ length: 255 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointment: Appointment[];

  @OneToMany(() => Service, service => service.doctor)
  services: Service[];

  @OneToMany(() => Schedule, schedule => schedule.doctor)
  schedules: Schedule[];

}