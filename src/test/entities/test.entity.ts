import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('test')
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id_test: string;

  @Column({ type: 'varchar', length: 255 })
  nom_test: string;

  @Column({ type: 'text' })
  path_file: string;
}
