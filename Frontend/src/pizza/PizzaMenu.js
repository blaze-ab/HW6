var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List').pizza_info;


$(".all").click(function () {
    initialiseMenu();
    $("#k").text(8);
    $(".var").text($(".all").text());
});
$(".meat").click(function () {
    filterPizza("meat");
    $(".var").text($(".meat").text());
});
$(".seafood").click(function () {
    filterPizza("ocean");
    $(".var").text($(".seafood").text());
});
$(".pineapple").click(function () {
    filterPizza("pineapple");
    $(".var").text($(".pineapple").text());
});
$(".mushrooms").click(function () {
    filterPizza("mushroom");
    $(".var").text($(".mushrooms").text());
});
$(".vegan").click(function () {
    filterPizza("vegan");
    $(".var").text($(".vegan").text());
});
//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    $pizza_list.html("");

    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);
        if (pizza.big)

            $node.find(".big").click(function () {
                if (check(pizza, "big") === false) {
                    PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
                }
            });

        $node.find(".small").click(function () {
            if (check(pizza, "small") === false) {
                PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
            }
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function check(pizza, size) {
    var present = false;
    for (var i = 0; i < PizzaCart.getPizzaInCart().length; i++) {
        if (PizzaCart.checkSim(pizza, i, size)) {
            present = true;
            break;
        }
    }
    return present;
}

function filterPizza(filter) {
    var pizza_shown = [];

    var q = 0;
    Pizza_List.forEach(function (pizza) {
        if (pizza.filters.findIndex(elem => elem === filter) != -1) {
            pizza_shown.push(pizza);
            q += 1;
        }
        $("#k").text(q);
    });

    showPizzaList(pizza_shown);
}


var API = require('../API');

function initialiseMenu() {
    $(".var").text("All variety");
    $("#k").text(8);
    API.getPizzaList(function (err, data) {
        if (err)
            return err;//callback(err); //?
        Pizza_List = data;
        showPizzaList(Pizza_List);
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;