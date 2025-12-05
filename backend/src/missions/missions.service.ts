import { Injectable } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MissionsService {
constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  // 2. Modificamos el método create para guardar en la BD
  async create(createMissionDto: CreateMissionDto) {
    // Crea una instancia de la entidad con los datos del DTO
    const newMission = this.missionRepository.create(createMissionDto);
    // La guarda en la BD (INSERT INTO...)
    return await this.missionRepository.save(newMission);
  }

  async findAll() {
    return await this.missionRepository.find();
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

}
