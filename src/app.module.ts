import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';
import { ConfigService, ConfigModule } from '@nestjs/config';

console.log(process.env.MONGO_DB_STRING)
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_STRING'),
      }),
      inject: [ConfigService],
    }),
    TodosModule
  ],
})
export class AppModule {}
