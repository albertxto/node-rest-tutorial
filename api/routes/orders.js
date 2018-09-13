const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

//models
const Order = require('../models/order');
const Product = require('../models/product');

//controllers
const OrdersController = require('../controllers/orders');

//read semua order
router.get('/', checkAuth, OrdersController.orders_get_all);

//create order
router.post('/', checkAuth, OrdersController.orders_create_order);

//read order berdasarkan id
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//update order berdasarkan id
router.patch('/:orderId', checkAuth, (req, res, next) => {
	res.status(200).json({
		message: 'Order updated',
		orderId: req.params.orderId
	});
});

//hapus order berdasarkan id
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;