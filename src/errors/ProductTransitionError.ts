export class ProductTransitionError extends Error {
  constructor(
    productId = "",
    productName = "",
    fromStatus,
    toStatus,
    ...params
  ) {
    super(...params);
    this.message = `Product: ${productName} (id: ${productId}) with status ${fromStatus} cannot be set to ${toStatus}`;
  }
}
