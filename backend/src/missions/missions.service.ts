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
    private missionRepository: Repository<Mission>,
    @InjectRepository(MissionInstance)
    private instanceRepository: Repository<MissionInstance>,
    private usersService: UsersService,
  ) { }

  // 1. Crear Plantilla (Mission)
  async create(createMissionDto: CreateMissionDto, user: User) {
    const newMission = this.missionRepository.create({
      ...createMissionDto,
      user,
      // Valores por defecto
      category: createMissionDto.category || MissionCategory.CUSTOM,
      recurrenceType: createMissionDto.recurrenceType || RecurrenceType.ONCE,
      startDate: createMissionDto.startDate || new Date(),
      isGlobal: false, // Aseguramos que las creadas por API no sean globales por error
    });
    return await this.missionRepository.save(newMission);
  }

  // 2. Obtener tareas de HOY (Misiones Instanciadas)
  async getTodayMissions(user: User) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Siempre ejecutamos el generador para asegurar que estén al día (Lazy Loading)
    await this.generateDailyInstances(user, today);

    return await this.instanceRepository.find({
      where: {
        user: { id: user.id },
        scheduledDate: today
      },
      relations: ['mission'],
      order: { isCompleted: 'ASC', createdAt: 'DESC' }
    });
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

    // Traer plantillas: Mis privadas + Globales del sistema
    const missions = await this.missionRepository.find({
      where: [
        { user: { id: user.id }, isActive: true },
        { isGlobal: true, isActive: true }
      ]
    });

    for (const mission of missions) {
      if (this.shouldCreateInstance(mission, date, dayOfWeek)) {
        
        // CORRECCIÓN CRÍTICA: Verificar si existe instancia PARA ESTE USUARIO
        const exists = await this.instanceRepository.findOne({
          where: { 
              mission: { id: mission.id }, 
              scheduledDate: date,
              user: { id: user.id } 
          }
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

  // Lógica de fechas
  private shouldCreateInstance(mission: Mission, date: Date, dayOfWeek: number): boolean {
    const dateTime = date.getTime();
    const start = mission.startDate ? new Date(mission.startDate).getTime() : 0;
    const end = mission.endDate ? new Date(mission.endDate).getTime() : Infinity;

    if (dateTime < start) return false;
    if (mission.endDate && dateTime > end) return false;

    switch (mission.recurrenceType) {
      case RecurrenceType.DAILY:
        return true;

      case RecurrenceType.WEEKLY:
        return mission.recurrenceDays?.includes(dayOfWeek) ?? false;

      case RecurrenceType.ONCE:
        return date.toISOString().split('T')[0] === new Date(mission.startDate).toISOString().split('T')[0];

      default:
        return false;
    }
  }

  // CRUD de Plantillas (Para gestión, no para jugar)
  async findAll(user: User) {
    return await this.missionRepository.find({
      where: [
        { isGlobal: true },
        { user: { id: user.id } }
      ],
      order: { createdAt: 'DESC' }
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
