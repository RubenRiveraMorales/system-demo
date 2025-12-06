import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionsModule } from './missions/missions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
    UsersModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}