import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { normalizePhone } from '../../common/phone.util';

export class LoginDto {
  @ApiProperty({ example: '01700000000' })
  @Transform(({ value }) => normalizePhone(String(value ?? '')))
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
