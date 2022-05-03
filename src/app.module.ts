import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [UsersModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
