import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  readonly apartmentListUrl: string;

  @IsOptional()
  @IsString()
  readonly multimediaPath?: string;

  @IsNotEmpty()
  @IsString()
  readonly propertyEmail: string;

  @IsNotEmpty()
  @IsString()
  readonly typeOfBuilding: string;

  @IsOptional()
  @IsString()
  readonly status?: string;
}
