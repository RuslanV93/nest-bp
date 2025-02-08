import { ApiProperty } from '@nestjs/swagger';

export class BlogInputDto {
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() websiteUrl: string;
}

export class BlogUpdateInputDto extends BlogInputDto {
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() websiteUrl: string;
}
