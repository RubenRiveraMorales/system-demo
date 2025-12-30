import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm'; // Importante: Between
import { Mission, RecurrenceType, MissionCategory } from './entities/mission.entity';
import { MissionInstance } from './entities/mission-instance.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>, private usersService: UsersService,
    @InjectRepository(MissionInstance)
    private instanceRepository: Repository<MissionInstance>,
  ) { }

  async create(createMissionDto: CreateMissionDto, user: User) {
    const newMission = this.missionRepository.create({
      ...createMissionDto,
      user,
      // Valores por defecto si no vienen
      category: createMissionDto.category || MissionCategory.CUSTOM,
      recurrenceType: createMissionDto.recurrenceType || RecurrenceType.ONCE,
      startDate: createMissionDto.startDate || new Date(), // Empieza hoy si no dicen fecha
    });
    return await this.missionRepository.save(newMission);
  }

  async getTodayMissions(user: User) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // A. Buscamos si ya existen instancias generadas para hoy
    let instances = await this.instanceRepository.find({
      where: {
        user: { id: user.id },
        scheduledDate: today
      },
      relations: ['mission'], // Traemos datos de la plantilla (titulo, xp)
      order: { isCompleted: 'ASC', createdAt: 'DESC' }
    });

    // B.(Safety Check)
    if (instances.length === 0) {
      await this.generateDailyInstances(user, today);

      // Volvemos a buscar después de generar
      instances = await this.instanceRepository.find({
        where: { user: { id: user.id }, scheduledDate: today },
        relations: ['mission'],
        order: { isCompleted: 'ASC' }
      });
    }

    return instances;
  }

  // 3. Completar una Instancia
  async complete(instanceId: number, userId: string) {
    const instance = await this.instanceRepository.findOne({
      where: { id: instanceId },
      relations: ['mission', 'user']
    });

    if (!instance) throw new NotFoundException('Misión no encontrada');
    if (instance.user.id !== userId) throw new ForbiddenException('No es tu misión');
    if (instance.isCompleted) throw new BadRequestException('Misión ya completada');

    instance.isCompleted = true;
    instance.completedAt = new Date();
    await this.instanceRepository.save(instance);

    // Dar XP al usuario
    return this.usersService.assignExperience(userId, instance.mission.xpReward);
  }

  // --- PRIVATE WORKER: El generador de misiones ---
  private async generateDailyInstances(user: User, date: Date) {
    const dayOfWeek = date.getDay();

    // 1. Traer todas las plantillas activas del usuario
    const missions = await this.missionRepository.find({
      where: { user: { id: user.id }, isActive: true }
    });

    for (const mission of missions) {
      if (this.shouldCreateInstance(mission, date, dayOfWeek)) {
        // Doble check: Asegurar que no exista ya (para no duplicar si corro esto 2 veces)
        const exists = await this.instanceRepository.findOne({
          where: { mission: { id: mission.id }, scheduledDate: date }
        });

        if (!exists) {
          const instance = this.instanceRepository.create({
            mission,
            user,
            scheduledDate: date,
            isCompleted: false
          });
          await this.instanceRepository.save(instance);
        }
      }
    }
  }

  // Lógica pura de validación de fechas
  private shouldCreateInstance(mission: Mission, date: Date, dayOfWeek: number): boolean {
    // Validar rango de fechas global
    const dateTime = date.getTime();
    const start = mission.startDate ? new Date(mission.startDate).getTime() : 0;
    const end = mission.endDate ? new Date(mission.endDate).getTime() : Infinity;

    // Nota: Las fechas string de la BD a veces necesitan conversión, TypeORM suele devolver Date objects
    if (dateTime < start) return false;
    if (mission.endDate && dateTime > end) return false;

    switch (mission.recurrenceType) {
      case RecurrenceType.DAILY:
        return true;

      case RecurrenceType.WEEKLY:
        // Si el array es null o vacío, no se crea
        return mission.recurrenceDays?.includes(dayOfWeek) ?? false;

      case RecurrenceType.ONCE:
        // Comparamos strings de fecha (YYYY-MM-DD) para ignorar horas
        return date.toISOString().split('T')[0] === new Date(mission.startDate).toISOString().split('T')[0];

      default:
        return false;
    }
  }


  async findAll(user: User) {
    return await this.missionRepository.find({
      where: [
        { isGlobal: true },
        { user: { id: user.id } }
      ],
      order: {
        createdAt: 'DESC'
      }
    });
  }


  async findOne(id: number) {
    return await this.missionRepository.findOneBy({ id });
  }


  async update(id: number, updateMissionDto: UpdateMissionDto) {
    await this.missionRepository.update(id, updateMissionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.missionRepository.delete(id);
    return { delete: true, message: 'Mission deleted successfully' };
  }

}

