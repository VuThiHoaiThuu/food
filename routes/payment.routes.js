const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Route tạo thanh toán
router.get('/', paymentController.createPayment);
router.post('/', paymentController.createPayment);

// Route callback từ ZaloPay
router.post('/callback', paymentController.callback);


// Route kiểm tra trạng thái đơn hàng
router.post('/check-status-order', paymentController.checkOrderStatus);

module.exports = router;
 
