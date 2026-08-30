const item = require('../models/inventory/item');
const StockTransaction = require('../models/inventory/stockTransaction');
const generateSKU = require('../utils/skuGenerator');

const getAllInventory = async (req,res)=>{
    try{
          const items = await item.find();
          res.status(200).json(items);
    }catch(err){
          console.log(err);   
          res.status(500).json({'message': err.message});       
    }
}

const createItem = async (req,res) =>{
  try{
    const {name,category,unitOfMeasure,unitPrice ,reorderPoint} = req.body;

    const generatedSKU =  await generateSKU(category,name);
    const newItem = new item({
      sku : generatedSKU,
      name,
      category,
      unitOfMeasure,
      unitPrice,
      reorderPoint,
      quantity : 0
    });
    await newItem.save();
    res.status(201).json({message : 'Item created' , item : newItem});
  }catch(err){
     console.log(err);
     
       res.status(500).json({message : err.message});
  }
}

const receiveStock =  async (req, res) => {
  const { sku, quantity, poNumber, remarks } = req.body;
  
  try {

   const foundItem = await item.findOne({sku : sku});
   if(!foundItem){
     return res.status(404).json({message : 'No item found with this sku'});
   }


    const transaction = new StockTransaction({
      itemId: foundItem._id,
      transactionType: 'RECEIPT',
      quantity,
      referenceNumber: poNumber,
      remarks
    });
    await transaction.save();

   foundItem.quantity += quantity;
   await foundItem.save();

    res.status(200).json({ message: 'Stock received and ledger updated', item : foundItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getAllInventory,receiveStock,createItem};
