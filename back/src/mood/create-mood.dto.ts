// DTO pra receber os dados de humor do front
export class CreateMoodDto {
  mood: number;
  emoji: string;
  energy: number;
  note?: string;
  userId: string;
}
