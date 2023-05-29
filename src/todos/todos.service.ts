import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTodoDto } from '../dto/post-to-do.dto';
import { Todo } from '../interfaces/todo.interface';

@Injectable()
export class TodosService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async createTodo(postTodoDto: PostTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(postTodoDto);
    return createdTodo.save();
  }
}