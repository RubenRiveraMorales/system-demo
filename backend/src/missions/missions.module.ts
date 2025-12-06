import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entities/mission.entity';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mission]), UsersModule],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
