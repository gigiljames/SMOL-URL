import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty({ message: 'URL is required' })
  @IsUrl({}, { message: 'Must be a valid URL (e.g. https://example.com)' })
  url: string;
}
