
var Templates = require('../Templates');

//pizza sizes
var PizzaSize = {
    Big: "big",
    Small: "small"
};

//array of pizzas in cart
var Cart = [];

var $cart = $("#orders");

//variables for tracking total number of orders and total price.
var totalPrice = 0;
var totalOrders = 0;
var able = false;


//checks if given pizza is the same pizza from particular place in array(cart).
function checkSim(pizza, i, size) {
    if (pizza.id === Cart[i].pizza.id && size === Cart[i].size) {
        Cart[i].node.find(".plus").click();
        return true;
    } else {
        return false;
    }
}

function addToCart(pizza, size) {
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1,
        priceDefault: pizza[size].price,
        price: pizza[size].price,
        node: null
    });
    totalOrders += 1;
    totalPrice += pizza[size].price;


    $(".pr").text(totalPrice + " grn");
    $("#tOrders").text(totalOrders);

    updateCart(Cart[Cart.length - 1]);
    updateLocalStorage(totalOrders, totalPrice, JSON.stringify(Cart));
}

function removeFromCart(cart_item) {

    var idx = Cart.indexOf(cart_item);
    Cart.splice(idx, 1);
}

function initialiseCart() {
    totalPrice = parseInt(localStorage.getItem("totalPrice"), 10);
    if (totalPrice) {
        Cart = JSON.parse(localStorage.getItem("cart"));
        totalOrders = parseInt(localStorage.getItem("totalOrders"), 10);
        $(".pr").text(totalPrice + " grn");
        $("#tOrders").text(totalOrders);
    }
    $cart.html("");
    Cart.forEach(updateCart);
}

function updateLocalStorage(totalOrders, totalPrice, Cart) {
    localStorage.setItem("totalOrders", totalOrders);
    localStorage.setItem("totalPrice", totalPrice);
    localStorage.setItem("cart", Cart);
}

function getPizzaInCart() {
    return Cart;
}

function getTotalPrice() {
    return totalPrice;
}

function updateCart(cart_item) {
    var html_code = Templates.PizzaCart_OneItem(cart_item);

    var $node = $(html_code);
    cart_item.node = $node;

    $cart.append($node);

    if (cart_item.quantity === 1) {
        var ability = true;
        $node.find(".minus").attr('disabled', true);
        $node.find(".minus").css("opacity", "0.7");
    }

    $node.find(".plus").click(function () {
        totalOrders += 1;
        if (ability === true) {
            $node.find(".minus").attr('disabled', false);
            ability = false;
            $node.find(".minus").css("opacity", "1");
        }
        totalPrice += cart_item.priceDefault;
        cart_item.quantity += 1;
        cart_item.price += cart_item.priceDefault;
        $("#tOrders").text(totalOrders);
        $(".pr").text(totalPrice + " grn");
        $node.find(".num").text(cart_item.quantity);
        $node.find(".price").text(cart_item.price + " grn");
        updateLocalStorage(totalOrders, totalPrice, JSON.stringify(Cart));
    });

    $node.find(".minus").click(function () {
        totalOrders -= 1;
        totalPrice -= cart_item.priceDefault;
        cart_item.quantity -= 1;
        cart_item.price -= cart_item.priceDefault;
        $node.find(".num").text(cart_item.quantity);
        $("#tOrders").text(totalOrders);
        $(".pr").text(totalPrice + " grn");
        $node.find(".price").text(cart_item.price + " grn");
        if (cart_item.quantity === 1) {
            $node.find(".minus").attr('disabled', true);
            ability = true;
            $node.find(".minus").css("opacity", "0.7");
        }
        updateLocalStorage(totalOrders, totalPrice, JSON.stringify(Cart));
    });

    $node.find(".x").click(function () {
        totalOrders -= cart_item.quantity;
        totalPrice -= cart_item.priceDefault * cart_item.quantity;
        $("#tOrders").text(totalOrders);
        $(".pr").text(totalPrice + " grn");
        $node.remove();
        removeFromCart(cart_item);
        updateLocalStorage(totalOrders, totalPrice, JSON.stringify(Cart));
    });
}

$('.b3').click(function () {
    Cart.splice(0, Cart.length);
    totalOrders = 0;
    totalPrice = 0;
    $("#tOrders").text(totalOrders);
    $(".pr").text(totalPrice + " grn");
    $cart.html("");
    updateLocalStorage("0", "0", JSON.stringify(Cart));
});

$('.zamovyty').click(function () {
    window.location.href = "/order.html";
});

exports.removeFromCart = removeFromCart;

exports.checkSim = checkSim;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.getTotalPrice = getTotalPrice;

exports.PizzaSize = PizzaSize;
