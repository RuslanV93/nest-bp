import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../domain/question.orm.domain';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}
  async findOne(id: number) {
    return this.questionRepository.findOne({ where: { id: id } });
  }
  async findOneOrNotFoundException(id: number) {
    const question = await this.findOne(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
  async createQuestion(question: Question) {
    const createdQuestion = this.questionRepository.create(question);
    const savedQuestion = await this.questionRepository.save(createdQuestion);
    return savedQuestion.id;
  }
  async save(question: Question) {
    return this.questionRepository.save(question);
  }
  async deleteQuestion(questionToDelete: Question) {
    await this.questionRepository.softRemove(questionToDelete);
  }
}
