import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuizQuestionsCorrectAnswerToArray1746021515467
  implements MigrationInterface
{
  name = 'QuizQuestionsCorrectAnswerToArray1746021515467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "question"
      ALTER COLUMN "correct_answer" TYPE text[]
      USING string_to_array("correct_answer", ',')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "question"
      ALTER COLUMN "correct_answer" TYPE text
      USING array_to_string("correct_answer", ',')
    `);
  }
}
