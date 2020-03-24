/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
    var Order = require('./pizza/orders.js');
    if (window.location.pathname == "/")
        PizzaMenu.initialiseMenu();
    if (window.location.pathname == "/order.html")
        Order.initOrder();

    PizzaCart.initialiseCart();
});