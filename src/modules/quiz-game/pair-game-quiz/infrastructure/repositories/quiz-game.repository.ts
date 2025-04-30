import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../../domain/game.orm.domain';
import { Repository } from 'typeorm';
import { Question } from '../../../question/domain/question.orm.domain';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findOne() {}
  async findFiveRandomQuestions() {
    const questions: Question[] = await this.questionRepository
      .createQueryBuilder('q')
      .orderBy(`RANDOM()`)
      .limit(5)
      .getMany();

    if (!questions.length) {
      throw new NotFoundException();
    }
    return questions;
  }

  async connection() {}

  async answer() {}

  async save(gameToSave: Game) {
    await this.gameRepository.save(gameToSave);
  }
}
