import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAllUsers() {
    return {
      message: 'List of users',
      data: {
        users: this.users,
      },
    };
  }

  findOneUser(userID: string) {
    const searchedUser = this.users.find((user) => user.ID === userID);

    return {
      message: !!searchedUser ? 'User' : 'No user found',
      data: {
        user: searchedUser || {},
      },
    };
  }
}
