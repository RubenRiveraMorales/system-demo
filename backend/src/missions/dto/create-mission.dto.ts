import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { MissionCategory, RecurrenceType } from "../entities/mission.entity";

export class CreateMissionDto {
  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt({ message: 'La recompensa de XP debe ser un número entero' })
  @Min(1, { message: 'La XP debe ser positiva' })
  xpReward: number;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  // --- campos nuevos ---

  @IsOptional()
  @IsEnum(MissionCategory, { message: 'Categoría no válida' })
  category?: MissionCategory;

  @IsOptional()
  @IsEnum(RecurrenceType, { message: 'Tipo de recurrencia no válido (once, daily, weekly)' })
  recurrenceType?: RecurrenceType;

  // validación del Array de días (0-6)
  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los días deben ser números (0=Dom, 6=Sab)' }) 
  @Min(0, { each: true })
  @Max(6, { each: true })
  recurrenceDays?: number[];

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida (YYYY-MM-DD)' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser válida (YYYY-MM-DD)' })
  endDate?: Date;

@IsOptional()
    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
        message: 'La hora debe ser en formato HH:MM (ej: 14:30)' 
    })
    reminderTime?: string;

}