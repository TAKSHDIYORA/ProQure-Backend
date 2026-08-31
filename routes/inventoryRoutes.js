const express = require('express');

const inventoryRouter = express.Router();
const {getAllInventory,receiveStock, createItem} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');


inventoryRouter.get('/',protect,getAllInventory);
inventoryRouter.post('/receive',protect,authorize('Admin','WarehouseWorker'),receiveStock);
inventoryRouter.post('/',protect,authorize('Admin','ProcurementManager'),createItem);



module.exports = inventoryRouter;

