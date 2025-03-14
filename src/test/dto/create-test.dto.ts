import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty({ description: 'Nom du test' })
  nom_test: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Fichier du test' })
  file: Express.Multer.File;
}