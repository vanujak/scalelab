import { Module } from '@nestjs/common';
import { PlaygroundsController } from './playgrounds.controller';
import { PlaygroundsService } from './playgrounds.service';

@Module({
  controllers: [PlaygroundsController],
  providers: [PlaygroundsService],
  exports: [PlaygroundsService],
})
export class PlaygroundsModule {}
