import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Trendy Fashion BD' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Rahim Uddin' })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({ example: '01700000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'STARTER', required: false })
  @IsOptional()
  @IsString()
  plan?: string;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
