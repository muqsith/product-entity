import { normalizeInput } from "../utils";
import { ProductTransitionError } from "../errors/ProductTransitionError";
import { TRANSITIONS } from "../constants/Product";

const isStatusTransitionAllowed = (fromStatus, toStatus): boolean => {
  let result = false;
  const availableToStatuses = TRANSITIONS.filter(
    (transition) => transition.from === fromStatus
  ).map((transition) => transition.to);
  result = availableToStatuses.indexOf(toStatus) !== -1;
  return result;
};

export class Product {
  // properties
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  status: string;

  constructor(data: Record<string, any>) {
    const normalizedData = normalizeInput(data);
    this.id = normalizedData.id;
    this.name = normalizedData.name;
    this.price = normalizedData.price;
    this.description = normalizedData.description;
    this.categoryId = normalizedData.categoryid;
    this.status = normalizedData.status;
  }

  transformStatus(newStatus) {
    const isTransitionAllowed = isStatusTransitionAllowed(
      this.status,
      newStatus
    );
    if (!isTransitionAllowed) {
      throw new ProductTransitionError(
        this.id,
        this.name,
        this.status,
        newStatus
      );
    } else {
      this.status = newStatus;
    }
  }
}
