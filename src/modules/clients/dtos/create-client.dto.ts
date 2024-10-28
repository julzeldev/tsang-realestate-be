import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsArray,
  IsBoolean,
  IsNumber,
  IsDate,
  Min,
  MaxLength,
} from 'class-validator';

class CreatePreferencesDto {
  @IsString()
  @IsOptional()
  area?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  zipCodes?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  beds?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  baths?: number;

  @IsBoolean()
  @IsOptional()
  washerDryerConnections?: boolean;

  @IsBoolean()
  @IsOptional()
  washerDryerIncluded?: boolean;

  @IsBoolean()
  @IsOptional()
  hasBalconyPatio?: boolean;

  @IsBoolean()
  @IsOptional()
  noCarpetInLiving?: boolean;

  @IsBoolean()
  @IsOptional()
  yard?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @IsDate()
  @IsOptional()
  earliestMoveIn?: Date;

  @IsDate()
  @IsOptional()
  latestMoveIn?: Date;
}

class CreateContactDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  instagram?: string;
}

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  contact: CreateContactDto;

  @IsNotEmpty()
  preferences: CreatePreferencesDto;
}
