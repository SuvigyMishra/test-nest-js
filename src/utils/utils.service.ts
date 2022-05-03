import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  parseFile(): object {
    return {
      message: 'File Parser',
    };
  }
}
