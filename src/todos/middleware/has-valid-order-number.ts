import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TodosService } from '../todos.service';
import { Todo } from 'src/interfaces/todo.interface';
import { CustomRequest } from 'src/interfaces/reqwithtodo.interface';
@Injectable()
export class OrderNumberValidationMiddleware implements NestMiddleware {
  constructor(private readonly todosService: TodosService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const orderNumber = parseInt(req.params.order_number, 10);


    if (isNaN(orderNumber) || orderNumber < 0) {
      throw new HttpException('Invalid order number', HttpStatus.BAD_REQUEST);
    }

    const todo = await this.todosService.getTodoByOrderNumber(orderNumber);

    if (!todo) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    // Attach the retrieved todo to the request object for later use in the route handler
    req.todo = todo;
    req.orderNumber = orderNumber

    next();
  }
}

