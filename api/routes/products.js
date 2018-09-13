const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, Date.now() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		//accept the file
		cb(null, true);
	}else{
		//reject the file
		cb(null, false);
	}
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

//read all products
router.get('/', ProductsController.products_get_all);

//create product
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

//read product by id
router.get('/:productId', ProductsController.products_get_product);

//update product by id
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

//delete product by id
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;