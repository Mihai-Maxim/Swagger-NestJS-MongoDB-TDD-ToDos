import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostTodoDto } from '../dto/post-to-do.dto';
import { Todo } from '../interfaces/todo.interface';
import { InsertIndex } from "../interfaces/insertindex.interface"
import { CheckpointsOperation } from 'src/interfaces/checkpointsOperation.interface';

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

  async interchangeOrderNumbers(orderNumber1: number, orderNumber2: number): Promise<void> {
    // Retrieve the todos based on their order_number
    const todo1 = await this.todoModel.findOne({ order_number: orderNumber1 });
    const todo2 = await this.todoModel.findOne({ order_number: orderNumber2 });
  
    // Swap the order numbers
    const tempOrderNumber = todo1.order_number;
    todo1.order_number = todo2.order_number;
    todo2.order_number = tempOrderNumber;
  
    // Save the updated todos
    await Promise.all([todo1.save(), todo2.save()]);
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
  

  async deleteTodoAndDecrementOrderNumbers(orderNumber: number): Promise<void> {
    await this.todoModel.deleteOne({ order_number: orderNumber });
  
    await this.todoModel.updateMany({ order_number: { $gt: orderNumber } }, { $inc: { order_number: -1 } });
    
  }

  async patchTodoWithCheckpoints(orderNumber: number, otherTodo: Todo, checkpointsOperation: CheckpointsOperation): Promise<Todo> {

    const todo = await this.todoModel.findOne({ order_number: orderNumber }, { _id: 0, __v: 0 }).lean().exec();

    let patchedTodo: Todo = { ...todo };
  
    if (checkpointsOperation.isBlindUpdate) {
      patchedTodo.checkpoints = otherTodo.checkpoints;
    } else if (checkpointsOperation.isIndexUpdate) {
      otherTodo.checkpoints.forEach((newCheckpoint) => {
        if (newCheckpoint.index >= 0 && newCheckpoint.index < patchedTodo.checkpoints.length) {
          patchedTodo.checkpoints[newCheckpoint.index] = {
            ...patchedTodo.checkpoints[newCheckpoint.index],
            ...newCheckpoint,
          };
        }
      });

      if (patchedTodo.checkpoints && patchedTodo.checkpoints.length) {
        for (let i = 0; i < patchedTodo.checkpoints.length; i++) {
            delete patchedTodo.checkpoints[i].index
        }
      }
    } else if (checkpointsOperation.isDelete) {

      const indexesToDelete = otherTodo.checkpoints.map((checkpoint) => checkpoint.index);
      patchedTodo.checkpoints = patchedTodo.checkpoints.filter(
        (checkpoint, index) => !indexesToDelete.includes(index)
      );
    }

    delete otherTodo.checkpoints

    patchedTodo = {
        ...patchedTodo,
        ...otherTodo
    }

    await this.todoModel.updateOne({ order_number: orderNumber }, patchedTodo);

    const updatedToDo = this.getTodoByOrderNumber(orderNumber)

    return updatedToDo;
  }

  async getCheckpointsOperation(checkpoints: any) {

    const containsOnlyIndex = checkpoints.every((checkpoint: any) =>
      checkpoint.hasOwnProperty('index') &&
      !checkpoint.hasOwnProperty('description') &&
      !checkpoint.hasOwnProperty('completed')
    );

    const blindUpdate = checkpoints.every((checkpoint: any) => {
        return !checkpoint.hasOwnProperty('index') && (checkpoint.hasOwnProperty('description') ||checkpoint.hasOwnProperty('completed'))
    })
    const indexUpdate = checkpoints.every((checkpoint: any) => {
        return checkpoint.hasOwnProperty('index') && (checkpoint.hasOwnProperty('description') || checkpoint.hasOwnProperty('completed'))
    })
  
    const response = {
        isBlindUpdate: blindUpdate,
        isIndexUpdate: indexUpdate,
        isDelete: containsOnlyIndex,
    }

    return response
  }

     
  async checkIndexesExist(orderNumber: number, indexes: number[]): Promise<boolean> {

    const todo = await this.todoModel.findOne({ order_number: orderNumber });

    const checkpointIndexes = todo.checkpoints.map((checkpoint, index) => index);
    return indexes.every((index) => checkpointIndexes.includes(index));
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