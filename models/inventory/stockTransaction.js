// models/StockTransaction.js
const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  transactionType: { type: String, enum: ['RECEIPT', 'ISSUE', 'ADJUSTMENT'], required: true },
  quantity: { type: Number, required: true }, 
  referenceNumber: { type: String }, 
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);