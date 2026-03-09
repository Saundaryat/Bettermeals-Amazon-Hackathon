import { api } from "@/lib/httpClient";

export interface IngredientAlias {
    _id: string;
    name: string;
    aliases?: string[];
    [key: string]: any;
}

export const searchIngredients = async (query: string, limit: number = 10) => {
    return api.get<IngredientAlias[]>(`/ingredients/search?query=${encodeURIComponent(query)}&limit=${limit}`, { requireAuth: true });
};
