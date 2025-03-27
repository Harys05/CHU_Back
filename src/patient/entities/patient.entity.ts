import { Appointment } from "src/appointment/entities/appointment.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";


@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointment: Appointment[];
}