/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List').pizza_info;

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {

    var contacts = " Ім'я: " + req.body.contact.name + " " + req.body.contact.surname + "\n Номер: " + req.body.contact.phone + "\n Email: " + req.body.contact.email +
        "\n Адреса: " + req.body.contact.address + "\n";
    var info = "Замовлення: \n";
    var num = 0;
    req.body.order.forEach(function (item) {
        info += ++num + " " + item.pizza.title + ". Розмір: " + item.size + ". Кількість: " + item.quantity + "\n";
        });

    var order = {
        version: 3,
        public_key: "sandbox_i84412395513",
        action: "pay",
        amount: req.body.price,
        currency: "UAH",
        description: contacts + "\n" + info,
        order_id: Math.random(),

        sandbox: 1
    };

    var data = base64(JSON.stringify(order));
    var signature = sha1("sandbox_bDappN0xOgzpIclS1oJoLOWolpWM9oZ0UNIecQjC" + data + "sandbox_bDappN0xOgzpIclS1oJoLOWolpWM9oZ0UNIecQjC");
    res.send({data: data, signature: signature});
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}