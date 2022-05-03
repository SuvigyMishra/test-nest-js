import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FileParserModule } from './file-parser/file-parser.module';

@Module({
  imports: [UsersModule, FileParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
