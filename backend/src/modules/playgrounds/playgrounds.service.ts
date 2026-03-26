import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../database/database.module';

export interface SavedPlayground {
  id: string;
  user_id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  created_at: string;
  updated_at: string;
}

@Injectable()
export class PlaygroundsService implements OnModuleInit {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS playgrounds (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name       TEXT NOT NULL DEFAULT 'Untitled Playground',
        nodes      JSONB NOT NULL DEFAULT '[]'::jsonb,
        edges      JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  async findAllByUser(userId: string): Promise<SavedPlayground[]> {
    const result = await this.pool.query(
      `SELECT id, user_id, name, nodes, edges, created_at, updated_at
       FROM playgrounds
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async findOne(id: string, userId: string): Promise<SavedPlayground> {
    const result = await this.pool.query(
      `SELECT id, user_id, name, nodes, edges, created_at, updated_at
       FROM playgrounds
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Playground not found.');
    }
    return result.rows[0];
  }

  async create(
    userId: string,
    name: string,
    nodes: unknown[],
    edges: unknown[],
  ): Promise<SavedPlayground> {
    if (!name?.trim()) {
      throw new BadRequestException('Playground name is required.');
    }
    const result = await this.pool.query(
      `INSERT INTO playgrounds (user_id, name, nodes, edges)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, name, nodes, edges, created_at, updated_at`,
      [userId, name.trim(), JSON.stringify(nodes), JSON.stringify(edges)],
    );
    return result.rows[0];
  }

  async update(
    id: string,
    userId: string,
    updates: { name?: string; nodes?: unknown[]; edges?: unknown[] },
  ): Promise<SavedPlayground> {
    // Ensure the playground exists and belongs to the user
    await this.findOne(id, userId);

    const setClauses: string[] = ['updated_at = NOW()'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      if (!updates.name?.trim()) {
        throw new BadRequestException('Playground name cannot be empty.');
      }
      setClauses.push(`name = $${paramIndex}`);
      values.push(updates.name.trim());
      paramIndex++;
    }
    if (updates.nodes !== undefined) {
      setClauses.push(`nodes = $${paramIndex}`);
      values.push(JSON.stringify(updates.nodes));
      paramIndex++;
    }
    if (updates.edges !== undefined) {
      setClauses.push(`edges = $${paramIndex}`);
      values.push(JSON.stringify(updates.edges));
      paramIndex++;
    }

    values.push(id);
    values.push(userId);

    const result = await this.pool.query(
      `UPDATE playgrounds
       SET ${setClauses.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING id, user_id, name, nodes, edges, created_at, updated_at`,
      values,
    );
    return result.rows[0];
  }

  async rename(
    id: string,
    userId: string,
    name: string,
  ): Promise<SavedPlayground> {
    return this.update(id, userId, { name });
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.pool.query(
      `DELETE FROM playgrounds WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('Playground not found.');
    }
  }
}
