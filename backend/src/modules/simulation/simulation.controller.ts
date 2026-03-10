import { Controller, Get, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('start')
  startSimulation() {
    return this.simulationService.startSimulation();
  }

  @Get('preview')
  getPreview() {
    return this.simulationService.getPreview();
  }
}
