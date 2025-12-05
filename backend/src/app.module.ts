import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user_admin',
      password: 'password123',
      database: 'activities_db',
      autoLoadEntities: true,
      synchronize: true,

    }),
    MissionsModule,

  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}