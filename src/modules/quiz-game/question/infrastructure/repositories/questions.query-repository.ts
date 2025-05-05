import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/question.orm.domain';
import {
  GetQuestionsQueryParams,
  QuestionPublishedType,
  QuestionSortBy,
} from '../../interfaces/dto/get-questions.query-params.input.dto';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { Repository } from 'typeorm';
import { QuestionViewDto } from '../../interfaces/dto/question.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class QuestionsQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}
  async getQuestionById(id: number) {
    const question: Question | null = await this.questionRepository.findOne({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return QuestionViewDto.mapToView(question);
  }
  async getQuestions(query: GetQuestionsQueryParams) {
    const validSortDirections =
      query.sortDirection === SortDirection.desc ||
      query.sortDirection === SortDirection.asc
        ? query.sortDirection === SortDirection.asc
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    const sortField =
      query.sortBy === QuestionSortBy.body ? QuestionSortBy.body : 'created_at';

    const countQuery = this.questionRepository.createQueryBuilder('question');

    const questionQuery = this.questionRepository
      .createQueryBuilder('question')
      .select('question.id', 'id')
      .addSelect('question.body', 'body')
      .addSelect('question.published', 'published')
      .addSelect('question.correctAnswer', 'correctAnswer')
      .addSelect('question.createdAt', 'createdAt')
      .addSelect('question.updatedAt', 'updatedAt');

    if (query.bodySearchTerm) {
      countQuery.where('question.body ILIKE :search', {
        search: `%${query.bodySearchTerm}%`,
      });
      questionQuery.where('question.body ILIKE :search', {
        search: `%${query.bodySearchTerm}%`,
      });
    } else {
      countQuery.where('1 = 1');
      questionQuery.where('1=1');
    }
    if (
      query.publishedStatus &&
      query.publishedStatus !== QuestionPublishedType.all
    ) {
      const isPublished =
        query.publishedStatus === QuestionPublishedType.published;
      questionQuery.andWhere('question.published = :search', {
        search: isPublished,
      });
      countQuery.andWhere('question.published = :search', {
        search: isPublished,
      });
    }
    questionQuery.orderBy(sortField, validSortDirections);
    questionQuery.limit(query.pageSize).offset(query.calculateSkipParam());

    const totalCount = await countQuery.getCount();

    const questions = await questionQuery.getRawMany();

    const items = questions.map(QuestionViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
