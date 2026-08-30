const express = require('express');

const inventoryRouter = express.Router();
const {getAllInventory,receiveStock, createItem} = require('../controllers/inventoryController');


inventoryRouter.get('/',getAllInventory);
inventoryRouter.post('/receive',receiveStock);
inventoryRouter.post('/',createItem);



module.exports = inventoryRouter;

