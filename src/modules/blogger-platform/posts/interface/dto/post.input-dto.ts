import { ApiProperty } from '@nestjs/swagger';

export class PostInputDto {
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiProperty() content: string;
  @ApiProperty() blogId: string;
}

export class PostUpdateInputDto extends PostInputDto {
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiProperty() content: string;
  @ApiProperty() blogId: string;
}
