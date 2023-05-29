import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTodoDto } from '../dto/post-to-do.dto';
import { Todo } from '../interfaces/todo.interface';
import { InsertIndex } from "../interfaces/insertindex.interface"

@Injectable()
export class TodosService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async getInsertIndex(order_number: number): Promise<InsertIndex> {

    const currentTodo = await this.todoModel.findOne({ order_number });

    if (currentTodo) {
      return { exists: true, adjacentExists: false };
    }
  
    const prevTodo = await this.todoModel.findOne({ order_number: (order_number - 1)});

    const nextTodo = await this.todoModel.findOne({ order_number: order_number + 1 });

    if (!prevTodo && !nextTodo && order_number === 0) {
        return { exists: false, adjacentExists: false, firstInsert: true };
    }
  
    return {
      exists: false,
      adjacentExists: (prevTodo !== null) || (nextTodo !== null),
    };
    
  }

  async incrementOrderNumbers(givenNumber: number): Promise<void> {
    await this.todoModel.updateMany(
        { order_number: { $gte: givenNumber } },
        { $inc: { order_number: 1 } }
    );
  }

  async getCollectionLength(): Promise<number> {
    const count = await this.todoModel.countDocuments();
    return count;
  }

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.todoModel
        .find({}, { _id: 0, __v: 0 })
        .sort({ order_number: 1 })
        .lean()
        .exec();
        
    if (todos && todos.length) {
      todos.forEach((todo: any) => {
        if (todo.checkpoints && todo.checkpoints.length) {
          todo.checkpoints = todo.checkpoints.map((checkpoint: any) => {
            const { _id, ...rest } = checkpoint;
            return rest;
          });
        }

        if (todo.checkpoints && !todo.checkpoints.length) {
            delete todo.checkpoints
        }
      });

    }
  
    if (todos && todos.length) {
        return todos
    } 

    return []
  }

  async getTodoByOrderNumber(orderNumber: number): Promise<Todo | null> {
    const todo = await this.todoModel.findOne({ order_number: orderNumber }, { _id: 0, __v: 0 }).lean().exec();

    if (todo && todo.checkpoints) {
      if (todo.checkpoints.length) {
        todo.checkpoints = todo.checkpoints.map((checkpoint: any) => {
            const { _id, ...rest } = checkpoint;
            return rest;
        });
      } else {
        delete todo.checkpoints
      }
    }
    return todo;
  }
  
  async createTodo(postTodoDto: PostTodoDto): Promise<Todo | Error> {

    const { order_number } = postTodoDto

    const hasOrderNumber = order_number || order_number === 0

    if (!hasOrderNumber) {
        const newOrderNumber = await this.getCollectionLength()
        postTodoDto.order_number = newOrderNumber

        const createdTodo = new this.todoModel(postTodoDto);
        const savedTodo = await createdTodo.save();
        const insertedToDo = await this.getTodoByOrderNumber(savedTodo.order_number)
        return insertedToDo
    }

    const { exists, adjacentExists, firstInsert } = await this.getInsertIndex(order_number)

    if (firstInsert) {
        postTodoDto.order_number = 0
        const createdTodo = new this.todoModel(postTodoDto);
        const savedTodo = await createdTodo.save();
        const insertedToDo = await this.getTodoByOrderNumber(savedTodo.order_number)
        return insertedToDo
    }

    if (!exists && adjacentExists) {
        const createdTodo = new this.todoModel(postTodoDto);
        const savedTodo = await createdTodo.save();
        const insertedToDo = await this.getTodoByOrderNumber(savedTodo.order_number)
        return insertedToDo
    }

    if (exists && !adjacentExists) {
        await this.incrementOrderNumbers(postTodoDto.order_number)
        const createdTodo = new this.todoModel(postTodoDto);
        const savedTodo = await createdTodo.save();
        const insertedToDo = await this.getTodoByOrderNumber(savedTodo.order_number)
        return insertedToDo
    }

    throw new Error("Invalid order_number")
  }
}