export class ProductTransitionError extends Error {
  constructor(fromStatus, toStatus, ...params) {
    super(...params);
    this.message = `Product with statue ${fromStatus} cannot be set to ${toStatus}`;
  }
}
