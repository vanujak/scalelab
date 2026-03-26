import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlaygroundsService } from './playgrounds.service';

class CreatePlaygroundDto {
  userId!: string;
  name!: string;
  nodes!: unknown[];
  edges!: unknown[];
}

class UpdatePlaygroundDto {
  userId!: string;
  name?: string;
  nodes?: unknown[];
  edges?: unknown[];
}

class RenamePlaygroundDto {
  userId!: string;
  name!: string;
}

class DeletePlaygroundDto {
  userId!: string;
}

@Controller('playgrounds')
export class PlaygroundsController {
  constructor(private readonly playgroundsService: PlaygroundsService) {}

  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.playgroundsService.findAllByUser(userId);
  }

  @Get(':id/user/:userId')
  findOne(@Param('id') id: string, @Param('userId') userId: string) {
    return this.playgroundsService.findOne(id, userId);
  }

  @Post()
  create(@Body() payload: CreatePlaygroundDto) {
    return this.playgroundsService.create(
      payload.userId,
      payload.name,
      payload.nodes,
      payload.edges,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdatePlaygroundDto) {
    return this.playgroundsService.update(id, payload.userId, {
      name: payload.name,
      nodes: payload.nodes,
      edges: payload.edges,
    });
  }

  @Patch(':id/rename')
  rename(@Param('id') id: string, @Body() payload: RenamePlaygroundDto) {
    return this.playgroundsService.rename(id, payload.userId, payload.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() payload: DeletePlaygroundDto) {
    return this.playgroundsService.remove(id, payload.userId);
  }
}
