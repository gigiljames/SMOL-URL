import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;
}
