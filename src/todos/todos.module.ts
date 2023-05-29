import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodoSchema } from "./todos.schema";
import { OrderNumberValidationMiddleware } from "./middleware/has-valid-order-number"
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(OrderNumberValidationMiddleware)
          .forRoutes({ path: '/api/todos/:order_number', method: RequestMethod.ALL });
      }
}
