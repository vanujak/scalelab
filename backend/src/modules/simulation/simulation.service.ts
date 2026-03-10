import { Injectable } from '@nestjs/common';
import { cacheHitRate } from './algorithms/cache-simulation';

@Injectable()
export class SimulationService {
  startSimulation() {
    return {
      simulationId: 'sim-seeded-001',
      status: 'queued',
      trafficConfig: {
        requestsPerMinute: 12000,
        durationMinutes: 15,
        algorithm: 'round-robin',
      },
    };
  }

  getPreview() {
    return {
      latencyMs: 182,
      throughputRps: 940,
      errorRate: 0.7,
      cacheHitRate: cacheHitRate(1000, 680),
    };
  }
}
