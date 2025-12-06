import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission, MissionCategory } from './entities/mission.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MissionsService {
constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>, private usersService: UsersService,
  ) {}

  // 2. Modificamos el método create para guardar en la BD
  async create(createMissionDto: CreateMissionDto, user: User) {
    // 1. RESTRICCIÓN: Solo Premium crea misiones
    if (!user.isPremium) {
       throw new ForbiddenException('Mejora tu cuenta a Premium para crear tus propias misiones.');
    }

    const newMission = this.missionRepository.create({
      ...createMissionDto,
      user,
      isGlobal: false, // Las creadas por user nunca son globales
      category: MissionCategory.CUSTOM 
    });
    return await this.missionRepository.save(newMission);
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


 async update(id: number, UpdateMissionDto: UpdateMissionDto){
    await this.missionRepository.update(id, UpdateMissionDto);
    return this.findOne(id);
 }

 async remove (id: number) {
    await this.missionRepository.delete(id);
    return { delete: true, message: 'Mission deleted successfully' };
 }

  async complete(id: number, userId: string) {
    // 1. Buscamos la misión
    const mission = await this.findOne(id);

    if (!mission) {
      throw new NotFoundException('Misión no encontrada');
    }
    return this.usersService.assignExperience(userId, mission.xpReward);
  }
}

