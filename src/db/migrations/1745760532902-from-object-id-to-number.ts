import { MigrationInterface, QueryRunner } from 'typeorm';

export class FromObjectIdToNumber1745760532902 implements MigrationInterface {
  name = 'FromObjectIdToNumber1745760532902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "PK_a3e67e5c0de8a982038a8b5b67e"`,
    );
    await queryRunner.query(`ALTER TABLE "email_info" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD "_id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "PK_a3e67e5c0de8a982038a8b5b67e" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "REL_2fd6ca44cab7998b3b41b134ef"`,
    );
    await queryRunner.query(`ALTER TABLE "email_info" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "UQ_2fd6ca44cab7998b3b41b134ef3" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "PK_e584ef7131aa04d6930d6c33594"`,
    );
    await queryRunner.query(`ALTER TABLE "password_info" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD "_id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "PK_e584ef7131aa04d6930d6c33594" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "REL_189219bdd0b4b01ef65ea1b89a"`,
    );
    await queryRunner.query(`ALTER TABLE "password_info" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "UQ_189219bdd0b4b01ef65ea1b89ac" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_e8a4d484f57ca6eed80065697e9"`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "_id"`);
    await queryRunner.query(`ALTER TABLE "device" ADD "_id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_e8a4d484f57ca6eed80065697e9" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "device" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "user__id"`);
    await queryRunner.query(`ALTER TABLE "device" ADD "user__id" integer`);
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" DROP CONSTRAINT "PK_b3127a17453bcf20f077bd89fc8"`,
    );
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "_id"`);
    await queryRunner.query(`ALTER TABLE "blog" ADD "_id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "PK_b3127a17453bcf20f077bd89fc8" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_83222441535a0be4f3da5b2ea73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "_id"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "_id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "blog_id"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "blog_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_07a80f934568e1c3dff4234dffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_f069f9101854625792dca32f117"`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "_id"`);
    await queryRunner.query(`ALTER TABLE "comment" ADD "_id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_f069f9101854625792dca32f117" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "post_id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "post_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_38d0d8dad294801ed4a15584710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "PK_ba13339518ee87e8f5f4bd31d8f"`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "_id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "PK_ba13339518ee87e8f5f4bd31d8f" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "post_id"`);
    await queryRunner.query(`ALTER TABLE "like_dislike" ADD "post_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP COLUMN "comment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "comment_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_457bfa3e35350a716846b03102d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "_id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "_id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e" FOREIGN KEY ("user__id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4" FOREIGN KEY ("blog_id") REFERENCES "blog"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_38d0d8dad294801ed4a15584710" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_83222441535a0be4f3da5b2ea73" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_07a80f934568e1c3dff4234dffe" FOREIGN KEY ("comment_id") REFERENCES "comment"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_07a80f934568e1c3dff4234dffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_83222441535a0be4f3da5b2ea73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_38d0d8dad294801ed4a15584710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_457bfa3e35350a716846b03102d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP COLUMN "comment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "comment_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "post_id"`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "post_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" DROP CONSTRAINT "PK_ba13339518ee87e8f5f4bd31d8f"`,
    );
    await queryRunner.query(`ALTER TABLE "like_dislike" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "PK_ba13339518ee87e8f5f4bd31d8f" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_38d0d8dad294801ed4a15584710" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "post_id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "post_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "PK_f069f9101854625792dca32f117"`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "PK_f069f9101854625792dca32f117" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_07a80f934568e1c3dff4234dffe" FOREIGN KEY ("comment_id") REFERENCES "comment"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "blog_id"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "blog_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_83222441535a0be4f3da5b2ea73" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" DROP CONSTRAINT "PK_b3127a17453bcf20f077bd89fc8"`,
    );
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "PK_b3127a17453bcf20f077bd89fc8" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4" FOREIGN KEY ("blog_id") REFERENCES "blog"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "user__id"`);
    await queryRunner.query(
      `ALTER TABLE "device" ADD "user__id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "device" ADD "user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_e8a4d484f57ca6eed80065697e9"`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "device" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_e8a4d484f57ca6eed80065697e9" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e" FOREIGN KEY ("user__id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "UQ_189219bdd0b4b01ef65ea1b89ac"`,
    );
    await queryRunner.query(`ALTER TABLE "password_info" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "REL_189219bdd0b4b01ef65ea1b89a" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" DROP CONSTRAINT "PK_e584ef7131aa04d6930d6c33594"`,
    );
    await queryRunner.query(`ALTER TABLE "password_info" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "PK_e584ef7131aa04d6930d6c33594" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_info" ADD CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "UQ_2fd6ca44cab7998b3b41b134ef3"`,
    );
    await queryRunner.query(`ALTER TABLE "email_info" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD "userId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "REL_2fd6ca44cab7998b3b41b134ef" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" DROP CONSTRAINT "PK_a3e67e5c0de8a982038a8b5b67e"`,
    );
    await queryRunner.query(`ALTER TABLE "email_info" DROP COLUMN "_id"`);
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD "_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "PK_a3e67e5c0de8a982038a8b5b67e" PRIMARY KEY ("_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_info" ADD CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
