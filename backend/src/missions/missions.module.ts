import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { UsersModule } from 'src/users/users.module';
import { MissionInstance } from './entities/mission-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, MissionInstance]), UsersModule, ],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
