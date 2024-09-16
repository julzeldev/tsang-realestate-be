import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  apartmentListUrl: string;

  @IsOptional()
  @IsString()
  multimediaPath?: string;

  @IsNotEmpty()
  @IsString()
  propertyEmail: string;

  @IsNotEmpty()
  @IsString()
  typeOfBuilding: string;

  @IsOptional()
  @IsString()
  status?: string;
}
