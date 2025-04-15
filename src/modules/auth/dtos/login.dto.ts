import { IsNotEmpty, IsNotIn, IsString } from 'class-validator';

export default class LoginDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsNotIn(['master'])
  tenant: string;
}
