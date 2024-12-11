const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const Order = require('../models/order.model');

// Config thông tin ZaloPay
const config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

exports.getPaymentInfo = (req, res) => {
    // Ví dụ trả về thông tin thanh toán cấu hình
    const paymentInfo = {
        app_id: config.app_id,
        description: 'Thanh toán qua ZaloPay',
        redirecturl: 'http://localhost:8080/menu',
    };
    
    return res.status(200).json(paymentInfo); // Trả về thông tin thanh toán
};

// Xử lý thanh toán
exports.createPayment = async (req, res) => {
    const embed_data = {
        redirecturl: 'http://localhost:8080/menu',
    };
    try {
        // Truy vấn đơn hàng mới nhất trong cơ sở dữ liệu
        const orderData = await Order.findOne().sort({ timeStamp: -1 }).populate('userId');
        if (!orderData) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const { _id: order_id, bill, items, userId } = orderData;
        const { grandTotal } = bill;

        if (!grandTotal || grandTotal <= 0) {
            return res.status(400).json({ error: 'Invalid order amount' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must include at least one item.' });
        }

       
        const itemss = [];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: 'username',
            app_time: Date.now(),
            item: JSON.stringify(itemss),
            embed_data: JSON.stringify(embed_data),
            amount: (grandTotal),
            callback_url: 'https://your-domain.ngrok-free.app/callback',
            description: `Payment for order`,
            bank_code: '',
        };

        // Tạo chữ ký MAC
        const data = [
            config.app_id,
            order.app_trans_id,
            order.app_user,
            order.amount,
            order.app_time,
            order.embed_data,
            order.item,
        ].join('|');
        console.log('Order data sent to ZaloPay:', order);
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        // Gửi yêu cầu đến ZaloPay
        const result = await axios.post(config.endpoint, null, { params: order });

        if (result.data.return_code === 1 && result.data.order_url) {
            return res.redirect(result.data.order_url); // Thành công
        }

        console.error('Payment failed:', result.data);
        return res.status(400).json({
            error: 'Payment failed',
            detail: result.data,
        });
    } catch (error) {
        console.error('Error creating payment:', error.message);
        return res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
};

// Callback xử lý khi ZaloPay gửi thông báo
exports.callback = (req, res) => {
    let result = {};
    try {
        const { data: dataStr, mac: reqMac } = req.body;

        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            const dataJson = JSON.parse(dataStr);
            console.log("Update order's status = success where app_trans_id =", dataJson.app_trans_id);

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
};

// Kiểm tra trạng thái đơn hàng
exports.checkOrderStatus = async (req, res) => {
    const { app_trans_id } = req.body;

    const postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(
            'https://sb-openapi.zalopay.vn/v2/query',
            null,
            { params: postData }
        );

        if (result.data.return_code === 1) {
            return res.status(200).json(result.data); // Thành công
        }

        console.error('Order status check failed:', result.data);
        return res.status(400).json({
            error: 'Failed to check order status',
            detail: result.data,
        });
    } catch (error) {
        console.error('Error checking order status:', error.message);
        res.status(500).json({ message: 'Failed to check order status', error: error.message });
    }
};
