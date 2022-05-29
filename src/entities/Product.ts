import { normalizeInput } from "../utils";
import { ProductTransitionError } from "../errors/ProductTransitionError";
import { STATUSES, TRANSITIONS } from "../constants/Product";

export class Product {
  // properties
  id: string;
  name: string;
  price: number;
  description: string;
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

  isTransitionAllowed(toStatus): boolean {
    let result = false;
    const availableToStatuses = TRANSITIONS.filter(
      (transition) => transition.from === this.status
    ).map((transition) => transition.to);
    result = availableToStatuses.indexOf(toStatus) !== -1;
    return result;
  }

  setStatusTo(toStatus) {
    const transitionAllowed = this.isTransitionAllowed(toStatus);
    if (!transitionAllowed) {
      throw new ProductTransitionError(this.status, toStatus);
    } else {
      this.status = toStatus;
    }
  }

  setStatusAvailable() {
    this.setStatusTo(STATUSES.AVAILABLE);
  }

  setStatusDraftDeleted() {
    this.setStatusTo(STATUSES.DRAFT_DELETED);
  }

  setStatusExpired() {
    this.setStatusTo(STATUSES.EXPIRED);
  }

  setStatusDeleted() {
    this.setStatusTo(STATUSES.DELETED);
  }

  setStatusReserved() {
    this.setStatusTo(STATUSES.RESERVED);
  }

  setStatusSold() {
    this.setStatusTo(STATUSES.SOLD);
  }

  setStatusReturned() {
    this.setStatusTo(STATUSES.RETURNED);
  }

  setStatusDraft() {
    this.setStatusTo(STATUSES.DRAFT);
  }
}
