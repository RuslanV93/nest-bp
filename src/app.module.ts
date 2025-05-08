import { configModule } from './config-module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, OnModuleInit } from '@nestjs/common';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { BloggersPlatformModule } from './modules/blogger-platform/bloggers-platform.module';
import { DropCollectionModule } from './modules/drop-collections/drop-collection.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './modules/notification/notification.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreConfig } from './core/core-config/core.config';
import { CoreModule } from './core/core-config/core.module';
import { SwaggerConfigService } from './config/swagger.setup';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { QuizGameModule } from './modules/quiz-game/quiz-game.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    configModule,

    CoreModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 30,
        },
      ],
    }),
    CqrsModule.forRoot(),

    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        host: coreConfig.postgresUrl,
        port: Number(coreConfig.postgresPort),
        username: coreConfig.postgresLogin,
        password: coreConfig.postgresPassword,
        database: coreConfig.postgresDbName,
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        logging: ['error'],
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
      }),
      inject: [CoreConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        const uri = coreConfig.mongoUri;

        return {
          uri: uri,
        };
      },
      inject: [CoreConfig],
    }),
    UsersAccountModule,
    BloggersPlatformModule,
    DropCollectionModule,
    NotificationModule,
    QuizGameModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger'),
      serveRoot: '/swagger',
    }),
  ],
  controllers: [AppController],
  providers: [CoreConfig, AppService, SwaggerConfigService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  // Добавляем typeorm-transactional после инициализации приложения
  async onModuleInit() {
    try {
      // Проверяем, подключено ли соединение, если нет, подключаем
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize(); // Инициализация подключения
      }

      // Добавляем поддержку транзакций
      addTransactionalDataSource(this.dataSource);
      console.log('Transactional added to DataSource successfully');
    } catch (error) {
      console.error('Failed to add transactional to DataSource:', error);
    }
  }
}
