import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  getMetrics() {
    return {
      summary: {
        latencyMs: 182,
        throughputRps: 940,
        errorRate: 0.7,
        serverUtilization: 61,
        cacheHitRate: 68,
      },
      timeline: [
        { tick: 1, latencyMs: 110 },
        { tick: 2, latencyMs: 132 },
        { tick: 3, latencyMs: 150 },
        { tick: 4, latencyMs: 182 },
        { tick: 5, latencyMs: 164 },
      ],
    };
  }
}
