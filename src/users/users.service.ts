import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async getUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    await this.usersRepository.delete(id);
    return { message: `Usuário com o ID ${id} removido com sucesso` };
  }
}
