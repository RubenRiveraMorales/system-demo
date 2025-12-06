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

  async assignExperience(id: string, points: number) {
  // 1. Buscamos al usuario
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) {
    throw new Error('User not found');
  }
  // 2. Sumamos la XP
  user.currentXp += points;
  let leveledUp = false;

  // 3. Lógica de Subida de Nivel (Level Up) 🧠
  // Fórmula: Cada nivel cuesta 100 puntos * Nivel Actual
  // Nivel 1 -> Pide 100 XP
  // Nivel 2 -> Pide 200 XP
  const xpToNextLevel = user.level * 100; 

  if (user.currentXp >= xpToNextLevel) {
    user.level++; 
    user.currentXp = user.currentXp - xpToNextLevel; // Reseteamos la barra (guardando el sobrante)
    leveledUp = true;
  }

  await this.usersRepository.save(user);

  return {
    level: user.level,
    currentXp: user.currentXp,
    leveledUp,
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
