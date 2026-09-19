export const allowedPOTransitions: Record<string, string[]> = {
  ISSUED: ["ACKNOWLEDGED", "CANCELLED"],

  ACKNOWLEDGED: ["IN_PRODUCTION", "CANCELLED"],

  IN_PRODUCTION: ["SHIPPED"],

  SHIPPED: ["DELIVERED"],

  DELIVERED: [],

  CANCELLED: [],
};
