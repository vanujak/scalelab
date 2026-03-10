import { Injectable } from '@nestjs/common';
import { SystemEntity } from './entities/system.entity';

@Injectable()
export class SystemsService {
  private readonly systems: SystemEntity[] = [
    {
      id: 'sys-ecommerce',
      name: 'E-commerce checkout',
      description: 'Load-balanced request path with cache-assisted reads.',
      status: 'draft',
      architecture: {
        nodes: [
          { id: 'n1', label: 'Users', type: 'client' },
          { id: 'n2', label: 'Load Balancer', type: 'load-balancer' },
          { id: 'n3', label: 'API Cluster', type: 'server' },
          { id: 'n4', label: 'Redis Cache', type: 'cache' },
          { id: 'n5', label: 'PostgreSQL', type: 'database' },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', label: 'HTTPS' },
          { id: 'e2', source: 'n2', target: 'n3', label: 'round robin' },
          { id: 'e3', source: 'n3', target: 'n4', label: 'read-through' },
          { id: 'e4', source: 'n4', target: 'n5', label: 'cache miss' },
        ],
      },
    },
  ];

  findAll() {
    return this.systems;
  }

  findById(id: string) {
    return this.systems.find((system) => system.id === id) ?? null;
  }
}
