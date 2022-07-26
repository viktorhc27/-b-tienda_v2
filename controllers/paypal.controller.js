const axios = require('axios')
const express = require('express');
const PaypalController = express();
const {
    PAYPAL_API,
    HOST,
    PAYPAL_API_CLIENT,
    PAYPAL_API_SECRET,
} = require('../config')


PaypalController.post("/create-order", async (req, res) => {
    try {
        let total = req.body.total
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total,
                    },
                },
            ],
            application_context: {
                brand_name: "TiendaVik.com",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${HOST}paypal/capture-order`,
                cancel_url: `${HOST}paypal/cancel-payment`,
            },
        };
        // format the body
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        // Generate an access token
        const { data: { access_token } } = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: PAYPAL_API_CLIENT,
                    password: PAYPAL_API_SECRET,
                },
            }
        );

        //console.log(access_token);

        let response = await axios.post(PAYPAL_API + "/v2/checkout/orders", order, { headers: { Authorization: `Bearer ${access_token}` } })

        //console.log(response.data)
        res.json(response.data);

    } catch (error) {
        res.json(error)
        console.log(error)

    }
})

PaypalController.get("/capture-order", async (req, res) => {
    const { token } = req.query;
    try {
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
                auth: {
                    username: PAYPAL_API_CLIENT,
                    password: PAYPAL_API_SECRET,
                },
            }
        );
        res.json({ response: "pagado", orden: response.data })

        /*  res.send("PAGADO") */

    } catch (error) {
        res.json(error)
        console.log(error)
    }
})

PaypalController.get("/cancel-order", async (req, res) => {
    res.send("cancel order")
})

module.exports = PaypalController
