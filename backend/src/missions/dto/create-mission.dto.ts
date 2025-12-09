import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateMissionDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty ({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt({ message: 'XP Reward must be an integer' })
  @Min(1, { message: 'XP Reward must be positive'})
  xpReward: number;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}