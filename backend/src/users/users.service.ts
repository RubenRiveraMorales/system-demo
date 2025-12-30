import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }


  async create(CreateUserDto: CreateUserDto){
    const { password, ...userData} = CreateUserDto;
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser)
  }

  private calculateXpToNextLevel(level: number): number {
    const baseXP = 100;
    const difficultyFactor = 1.6; // subir nivel se vuelve más difícil
    return Math.floor(baseXP * Math.pow(level, difficultyFactor));
  }

async assignExperience(id: string, points: number) {
    // 1. Buscamos al usuario
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Sumar xp
    user.currentXp += points;
    let leveledUp = false;
    let startLevel = user.level;

    // 3. Bucle while
    // Esto permite subir múltiples niveles si la XP ganada es mucha
    while (true) {
      const xpToNextLevel = this.calculateXpToNextLevel(user.level);

      if (user.currentXp >= xpToNextLevel) {
        user.level++;
        user.currentXp -= xpToNextLevel;
        leveledUp = true;
      } else {
        break;
      }
    }

    await this.usersRepository.save(user);

    return {
      level: user.level,
      currentXp: user.currentXp,
      xpToNextLevel: this.calculateXpToNextLevel(user.level),
      leveledUp,
      levelsGained: user.level - startLevel,
      xpEarned: points
    };
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({id});
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({email});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
