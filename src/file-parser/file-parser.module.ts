import { Module } from '@nestjs/common';
import { FileParserController } from './file-parser.controller';
import { FileParserService } from './file-parser.service';

@Module({
  controllers: [FileParserController],
  providers: [FileParserService],
})
export class FileParserModule {}
