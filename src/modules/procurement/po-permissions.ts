export const canChangePOStatus = (
  currentStatus: string,
  newStatus: string,
  isBuyer: boolean,
): boolean => {
  if (isBuyer) {
    return currentStatus === "SHIPPED" && newStatus === "DELIVERED";
  }

  return (
    (currentStatus === "ISSUED" && newStatus === "ACKNOWLEDGED") ||
    (currentStatus === "ACKNOWLEDGED" && newStatus === "IN_PRODUCTION") ||
    (currentStatus === "IN_PRODUCTION" && newStatus === "SHIPPED")
  );
};
