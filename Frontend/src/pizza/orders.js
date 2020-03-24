var API = require('../API');
var PizzaCart = require('./PizzaCart');
var Maps = require('../Maps');
var LiqPay = require('../LiqPay');
var map;
var home;
var direction;
var homeIcon = "assets/images/home-icon.png";

function initItem(input, text, inputText, textText){
    if(inputText){
        input.value = inputText;
        text.text(textText);
    }
}
function clickToChangeAddress() {
    google.maps.event.addListener(map, 'click',
        function (click) {
            destination(null, click.latLng);
        });
}

function initOrder(){
    var fname = localStorage.getItem("name");
    initItem($("#first_name"), $("#name"), fname, fname);

    var lname = localStorage.getItem("surname");
    initItem($("#last_name"), $("#surname"), lname, lname);

    var address = localStorage.getItem("address");
    initItem($("#home_address"), $("#address2"), address, address);

    var phone = localStorage.getItem("number");
    initItem($("#phone_number"), $("#phone"), phone, phone);

    var email = localStorage.getItem("email");
    initItem($("#email"), $("#email2"), email, email);

    var time = localStorage.getItem("time");
    if (time)
        $("#time").text(time);

    var h = localStorage.getItem("home");
    if (h)
        h = JSON.parse(h);
    var loadMap = google.maps.event.addDomListener(window, 'load', Maps.initialize(h));
    map = loadMap.i.map;
    home = loadMap.i.home;
    direction = loadMap.i.direction;

    clickToChangeAddress();
}

function destination(err, LatLng) {
    if (err)
        alert(err);
    else {
        if (home)
            home.setMap(null);
        home = Maps.setMarker(LatLng, homeIcon);
        localStorage.setItem("home", JSON.stringify({
            data: LatLng,
            icon: homeIcon
        }));

        if (direction)
            direction.setMap(null);
        direction = Maps.calculateRoute(Maps.mainCoord, LatLng, function (err, data) {
            if (err)
                alert(err);
            else {
                $("#home_address").val(data.address);
                localStorage.setItem("address", data.address);
                $("#address2").text(data.address);
                localStorage.setItem("time", data.duration.text);
                $("#time").text(data.duration.text);
            }
        });
    }
}


$('.send').click(function () {
    API.createOrder({
        contact: {
            name: $("#name").text(),
            surname: $("#surname").text(),
            address:$("#address2").text(),
            phone:$("#phone").text(),
            email:$("#email2").text(),
        },
        order: PizzaCart.getPizzaInCart(),
        price: PizzaCart.getTotalPrice()
    }, function (err, data) {
        if (err)
            return err;
        LiqPay.LiqPay(data.data, data.signature);
    });
});

$("#first_name").blur(function ()
{
    var name = document.getElementById("first_name");
        $('#name').text(name.value);
        localStorage.setItem("name", name.value);
});

$("#last_name").blur(function ()
{
    var lname = document.getElementById("last_name");
        $('#surname').text(lname.value);
        localStorage.setItem("surname", lname.value);
});

$("#home_address").blur(function ()
{
    var address = document.getElementById("home_address");
    $('#address2').text(address.value);
    localStorage.setItem("address", address.value);
    if(address.value){
        Maps.geocodeAddress("Киев," + address.value,
            function (err, LatLng) {
                destination(err, LatLng);
            })
    }
    if (home)
        home.setMap(null);
    localStorage.setItem("home", "");
    if (direction)
        direction.setMap(null);
});

$("#phone_number").blur(function ()
{
    var phone = document.getElementById("phone_number");
    var check = /^\+38(0\d{9})$/.test(phone.value);
    if(check)
    {
        $('#phone').text(phone.value);
        localStorage.setItem("number", phone.value);
    }
});

$("#email").blur(function ()
{
    var email = document.getElementById("email");
    var check =  /.+@.+\..+/.test(email.value);
    if(check) {
        $('#email2').text(email.value);
        localStorage.setItem("email", email.value);
    }
});

exports.initOrder = initOrder;