import { Controller, Post, Get, Body, HttpException, HttpStatus, Req, Patch, Put, Delete, HttpCode } from '@nestjs/common';
import { PostTodoDto } from "../dto/post-to-do.dto"
import { PatchTodoDto } from "../dto/patch-to-do.dto"
import { PutTodoDto } from '../dto/put-to-do.dto';
import { TodosService } from './todos.service'

import { CustomRequest } from 'src/interfaces/reqwithtodo.interface';

import { CheckpointsOperation } from "../interfaces/checkpointsOperation.interface"

@Controller('/api/todos')

export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Post()
    async postTodo(@Body() postTodoDto: PostTodoDto): Promise<any> {
        try {
            const createdTodo = await this.todosService.createTodo(postTodoDto);
            return createdTodo;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllTodos(): Promise<any> {
        const allTodos = await this.todosService.getAllTodos()
        return allTodos
    }

    @Get(':order_number')
    async getTodoByOrderNumber(@Req() req: CustomRequest): Promise<any> {
      return req.todo;
    }

    
    @Delete(':order_number')
    @HttpCode(204)
    async deleteTodoByOrderNumber(@Req() req: CustomRequest): Promise<void> {
        await this.todosService.deleteTodoAndDecrementOrderNumbers(req.orderNumber)
    }

    @Put(":order_number")
    async putToDoByOrderNumber(@Body() putTodoDto: PutTodoDto, @Req() req: CustomRequest): Promise<any> {
        const { order_number } = putTodoDto

        if (order_number || order_number === 0) {
            const targetToDo = await this.todosService.getTodoByOrderNumber(order_number)
            
            if (!targetToDo) {
                throw new HttpException(`target todo ${targetToDo} not found`, HttpStatus.NOT_FOUND);
            }
        }

        var checkpointsOperation: CheckpointsOperation = {
            isBlindUpdate: true,
            isIndexUpdate: false,
            isDelete: false
        }

        delete putTodoDto.order_number
        
        const patchedToDo = await this.todosService.patchTodoWithCheckpoints(req.orderNumber, putTodoDto, checkpointsOperation)

        let targetOrderNumber = req.orderNumber

        if ((order_number || order_number === 0) && order_number !== req.orderNumber) {
            await this.todosService.interchangeOrderNumbers(order_number, req.orderNumber)
            targetOrderNumber = order_number
        }

        patchedToDo.order_number = targetOrderNumber

        return patchedToDo

    }

    @Patch(":order_number")
    async patchToDoByOrderNumber(@Body() patchTodoDto: PatchTodoDto, @Req() req: CustomRequest): Promise<any> {

        const { order_number } = patchTodoDto

        if (order_number || order_number === 0) {
            const targetToDo = await this.todosService.getTodoByOrderNumber(order_number)
            
            if (!targetToDo) {
                throw new HttpException(`target todo ${targetToDo} not found`, HttpStatus.NOT_FOUND);
            }
        }

        var checkpointsOperation: CheckpointsOperation = {
            isBlindUpdate: true,
            isIndexUpdate: false,
            isDelete: false
        }

        if (patchTodoDto.checkpoints && patchTodoDto.checkpoints.length) {
           
            checkpointsOperation = await this.todosService.getCheckpointsOperation(patchTodoDto.checkpoints)

            const { isBlindUpdate, isIndexUpdate, isDelete } = checkpointsOperation

            let hasValidIndexes = true

            if (!(isBlindUpdate || isIndexUpdate || isDelete)) {
                throw new HttpException(`Checkpoints must respect the following scheme: blind update => do not specify index fields, delete: only specify the index fields, specific update: specify the index for every checkpoint. Checkpoint indexes must be unique.`, HttpStatus.BAD_REQUEST);
            }

            if (isIndexUpdate || isDelete) {

                function hasDuplicates(array) {
                    return (new Set(array)).size !== array.length;
                }

                const indexes = patchTodoDto.checkpoints.map(checkpoint => checkpoint.index)

                if (hasDuplicates(indexes)) throw new HttpException("the checkpoint indexes must be unique", HttpStatus.BAD_REQUEST);

                hasValidIndexes = await this.todosService.checkIndexesExist(req.orderNumber, indexes)

                if (!hasValidIndexes) {
                    throw new HttpException(`the checkpoint indexes were not found in the specified todo`, HttpStatus.BAD_REQUEST);
                }
            }

        }

        delete patchTodoDto.order_number
        
        const patchedToDo = await this.todosService.patchTodoWithCheckpoints(req.orderNumber, patchTodoDto, checkpointsOperation)

        let targetOrderNumber = req.orderNumber

        if ((order_number || order_number === 0) && order_number !== req.orderNumber) {
            await this.todosService.interchangeOrderNumbers(order_number, req.orderNumber)
            targetOrderNumber = order_number
        }

        patchTodoDto.order_number = targetOrderNumber

        return patchedToDo

    }



}


