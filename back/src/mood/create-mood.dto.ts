// DTO pra receber os dados de humor do front com validação
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMoodDto {
  @IsInt()
  @Min(0)
  @Max(4)
  mood: number;

  @IsString()
  emoji: string;

  @IsInt()
  @Min(0)
  @Max(100)
  energy: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  userId: string;
}
