import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './modules/metrics/metrics.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { SystemsModule } from './modules/systems/systems.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, SystemsModule, SimulationModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
