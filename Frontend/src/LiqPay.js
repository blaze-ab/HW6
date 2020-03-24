
function LiqPay(data, signature) {
    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay_checkout",
        mode: "popup", // embed || popup,
        language: "uk",
    }).on("liqpay.callback", function (data) {
        console.log(data.status);
        console.log(data);
    }).on("liqpay.ready", function (data) {
        // ready
        console.log(data.status);
        console.log(data);
    }).on("liqpay.close", function (data) {
        // close
    });
}

exports.LiqPay = LiqPay;