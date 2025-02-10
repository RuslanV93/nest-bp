import { BlogDomainDto } from './dto/blog.domain-dto';
import { BlogDocument } from './blogs.model';
import { BlogInputDto } from '../interface/dto/blog.input-dto';

export class DomainBlog {
  constructor(
    private name: string,
    private description: string,
    private websiteUrl: string,
    private isMembership: boolean,
  ) {
    this.validateFields();
  }
  private validateFields(): void {
    // const websiteUrlRegex =
    //   /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    // if (!websiteUrlRegex.test(this.websiteUrl)) {
    //   throw new Error('Invalid website URL format');
    // }
  }

  static create(name: string, description: string, websiteUrl: string) {
    const isMembership = false;
    return new DomainBlog(name, description, websiteUrl, isMembership);
  }
  static update(
    currentBlog: BlogDocument,
    updateDto: BlogInputDto,
  ): DomainBlog {
    return new DomainBlog(
      updateDto.name || currentBlog.name,
      updateDto.description || currentBlog.description,
      updateDto.websiteUrl || currentBlog.websiteUrl,
      currentBlog.isMembership,
    );
  }

  toSchema(): BlogDomainDto {
    return {
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      isMembership: this.isMembership,
    };
  }
}
