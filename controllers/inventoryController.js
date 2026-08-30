const item = require('../models/inventory/item');
const stockTransaction = require('../models/inventory/stockTransaction');


const getAllInventory = async (req,res)=>{
    try{
          const items = await item.find();
    }catch(err){

    }
}
