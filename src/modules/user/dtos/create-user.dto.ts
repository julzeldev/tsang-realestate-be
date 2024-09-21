import { IsString, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema'; // Assuming UserRole is exported from user.schema

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
