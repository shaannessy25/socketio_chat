var usersList = [];
var myNick = "";
isTyping = false;

var socket = io();

socket.on("connect", function (e) {
    socket.emit("start");
});

socket.on("nick", function (nick) {
    myNick = nick;
});

$("form").submit(function () {
    var temp = [myNick, $("#boxMessage").val()];
    socket.emit("send chat message", temp);
    $("#boxMessage").val("");
    imTyping = false;
    socket.emit("not typing");
    return false;
});

socket.on("chat message", function (msg) {
    $("#messages").append("<li><b>" + msg[0] + ":</b> " + msg[1]);
});

socket.on("info", function (inf) {
    $("#messages").append("<li><i>" + inf + "</i></li>");
});

socket.on("users list", function (usersList) {
    updateUserList(usersList);
});

socket.on("typing signal", function (usersList) {
    updateUserList(usersList);
});

function setMyName() {
    myNick = document.getElementById("boxNick").value;
    socket.emit("set nick", myNick);
    document.getElementById("boxNick").disabled = true;
    document.getElementById("buttonNick").hidden = true;
    document.getElementById("boxMessage").disabled = false;
    document.getElementById("buttonMessage").disabled = false;
}

function updateUserList(u) {
    var list = document.getElementById("ulist");
    list.innerHTML = "";

    for (var i = 0; i < u.length; i++) {
        var item = document.createElement("li");
        item.innerHTML = u[i];
        list.appendChild(item);
    }
}

$("#boxMessage").on("input", function () {
    if ($("#boxMessage").val().length != "" && isTyping == false) {
        socket.emit("typing");
        isTyping = true;
    } else if ($("#boxMessage").val() == "") {
        socket.emit("not typing");
        isTyping = false;
    }
});