import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDbLocalPgeTests21746015503176 implements MigrationInterface {
    name = 'InitDbLocalPgeTests21746015503176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_info" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "confirm_code" character varying NOT NULL, "code_expiration_date" TIMESTAMP, "is_confirmed" boolean NOT NULL, "email_confirmation_cooldown" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "REL_2fd6ca44cab7998b3b41b134ef" UNIQUE ("userId"), CONSTRAINT "PK_a3e67e5c0de8a982038a8b5b67e" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "password_info" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "password_hash" character varying NOT NULL, "password_recovery_code" character varying, "password_recovery_code_expiration_date" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "REL_189219bdd0b4b01ef65ea1b89a" UNIQUE ("userId"), CONSTRAINT "PK_e584ef7131aa04d6930d6c33594" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "device" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "user_id" integer NOT NULL, "ip" character varying NOT NULL, "last_activity" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "token_version" character varying NOT NULL, "device_id" character varying NOT NULL, "user__id" integer, CONSTRAINT "PK_e8a4d484f57ca6eed80065697e9" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "description" character varying NOT NULL, "website_url" character varying NOT NULL, "is_membership" boolean NOT NULL, CONSTRAINT "PK_b3127a17453bcf20f077bd89fc8" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "title" character varying NOT NULL, "short_description" character varying NOT NULL, "content" character varying NOT NULL, "blog_id" integer NOT NULL, CONSTRAINT "PK_e4da8286ae74bb02b3856ec85a8" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "content" character varying NOT NULL, "user_id" integer NOT NULL, "post_id" integer NOT NULL, CONSTRAINT "PK_f069f9101854625792dca32f117" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."like_dislike_status_enum" AS ENUM('Like', 'Dislike', 'None')`);
        await queryRunner.query(`CREATE TYPE "public"."like_dislike_parent_enum" AS ENUM('POST', 'COMMENT')`);
        await queryRunner.query(`CREATE TABLE "like_dislike" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "user_id" integer NOT NULL, "status" "public"."like_dislike_status_enum" NOT NULL DEFAULT 'None', "post_id" integer, "comment_id" integer, "parent" "public"."like_dislike_parent_enum" NOT NULL, CONSTRAINT "PK_ba13339518ee87e8f5f4bd31d8f" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "login" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "correct_answer" text NOT NULL, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_info" ADD CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_info" ADD CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e" FOREIGN KEY ("user__id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4" FOREIGN KEY ("blog_id") REFERENCES "blog"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_38d0d8dad294801ed4a15584710" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_83222441535a0be4f3da5b2ea73" FOREIGN KEY ("post_id") REFERENCES "post"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_dislike" ADD CONSTRAINT "FK_07a80f934568e1c3dff4234dffe" FOREIGN KEY ("comment_id") REFERENCES "comment"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_07a80f934568e1c3dff4234dffe"`);
        await queryRunner.query(`ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_83222441535a0be4f3da5b2ea73"`);
        await queryRunner.query(`ALTER TABLE "like_dislike" DROP CONSTRAINT "FK_38d0d8dad294801ed4a15584710"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_8770b84ec0b63d5c726a0681df4"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_4c3a71a06a616c3582d0ffa732e"`);
        await queryRunner.query(`ALTER TABLE "password_info" DROP CONSTRAINT "FK_189219bdd0b4b01ef65ea1b89ac"`);
        await queryRunner.query(`ALTER TABLE "email_info" DROP CONSTRAINT "FK_2fd6ca44cab7998b3b41b134ef3"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "like_dislike"`);
        await queryRunner.query(`DROP TYPE "public"."like_dislike_parent_enum"`);
        await queryRunner.query(`DROP TYPE "public"."like_dislike_status_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "password_info"`);
        await queryRunner.query(`DROP TABLE "email_info"`);
    }

}
