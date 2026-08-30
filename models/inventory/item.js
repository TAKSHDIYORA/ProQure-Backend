// models/InventoryItem.js
const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  quantity: { type: Number, default: 0 },
  unitOfMeasure: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  reorderPoint: { type: Number, required: true },
  primarySupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  warehouseLocation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);