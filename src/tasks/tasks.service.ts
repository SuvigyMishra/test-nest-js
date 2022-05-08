import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task } from './task.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('No task found');
    }

    return task;
  }
}
