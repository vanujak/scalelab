import { apiJson, apiGet } from "@/services/api";
import type { PlaygroundNode, PlaygroundEdge } from "@/types/playground";

export type SavedPlayground = {
  id: string;
  user_id: string;
  name: string;
  nodes: PlaygroundNode[];
  edges: PlaygroundEdge[];
  created_at: string;
  updated_at: string;
};

export const playgroundService = {
  getAll(userId: string) {
    return apiGet<SavedPlayground[]>(`/playgrounds/user/${userId}`);
  },

  getOne(id: string, userId: string) {
    return apiGet<SavedPlayground>(`/playgrounds/${id}/user/${userId}`);
  },

  create(userId: string, name: string, nodes: PlaygroundNode[], edges: PlaygroundEdge[]) {
    return apiJson<SavedPlayground>("/playgrounds", {
      method: "POST",
      body: JSON.stringify({ userId, name, nodes, edges }),
    });
  },

  update(id: string, userId: string, data: { name?: string; nodes?: PlaygroundNode[]; edges?: PlaygroundEdge[] }) {
    return apiJson<SavedPlayground>(`/playgrounds/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ userId, ...data }),
    });
  },

  rename(id: string, userId: string, name: string) {
    return apiJson<SavedPlayground>(`/playgrounds/${id}/rename`, {
      method: "PATCH",
      body: JSON.stringify({ userId, name }),
    });
  },

  remove(id: string, userId: string) {
    return apiJson<void>(`/playgrounds/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    });
  },
};
