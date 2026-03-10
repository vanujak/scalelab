import { Controller, Get, Param } from '@nestjs/common';
import { SystemsService } from './systems.service';

@Controller('systems')
export class SystemsController {
  constructor(private readonly systemsService: SystemsService) {}

  @Get()
  findAll() {
    return this.systemsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.systemsService.findById(id);
  }
}
