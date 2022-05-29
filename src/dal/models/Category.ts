import { normalizeInput } from "../../utils";
export class Category {
  id: string;
  parentId: string;
  name: string;
  archived: boolean;
  constructor(data: Record<string, any>) {
    const normalizedData = normalizeInput(data);
    this.id = normalizedData.id;
    this.parentId = normalizedData.parentid;
    this.name = normalizedData.name;
    this.archived = normalizedData.archived;
  }
}
