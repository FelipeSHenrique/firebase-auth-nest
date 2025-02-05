import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
