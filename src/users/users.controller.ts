import { UsersService } from './users.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAllUsers(): object {
    return this.userService.findAllUsers();
  }

  @Get(':userID')
  findUser(@Param('userID') userID: string): object {
    return this.userService.findOneUser(userID);
  }
}
