const socket = new SockJS("https://dolphin-app-eqkxi.ondigitalocean.app/websocket");
const messageList = document.getElementById("messageList")
const sendText = document.getElementById("sendText")
const sendBtn = document.getElementById("sendBtn")
const createUserNameForm = document.getElementById("createUserNameForm")
const createPasswordForm = document.getElementById("createPasswordForm")
const createUserBtn = document.getElementById("createUserBtn")
const loginUsernameForm = document.getElementById("loginUsernameForm")
const loginPasswordForm = document.getElementById("loginPasswordForm")
const loginUserBtn = document.getElementById("loginUserBtn")

const stompClient = new Stomp.over(socket);

stompClient.connect({}, (frame) => {
    console.log("connected :)");
    stompClient.subscribe("/topic/greetings", (greeting) => {
        console.log(JSON.parse(greeting.body).content)

        let li = document.createElement("li");
        li.innerText = JSON.parse(greeting.body).content;
        messageList.appendChild(li)

    })

    stompClient.subscribe("/topic/chat", (chat) => {
        console.log(JSON.parse(chat.body).chat)

        let li = document.createElement("li");
        li.innerText = JSON.parse(chat.body).chat;
        messageList.appendChild(li)
    })

    sendHello("Jacob")
})

function sendHello(name) {
    stompClient.send("/app/hello", {}, JSON.stringify({ "name": name }))
}

sendBtn.addEventListener("click", () => {
    stompClient.send("/app/chat", {}, JSON.stringify({ "content": sendText.value }))
    sendText.innerHTML = "";
})

createUserBtn.addEventListener("click", () => {
    createUser();
})

loginUserBtn.addEventListener("click", () => {
    loginUser();
})

function loginUser() {
    fetch("https://dolphin-app-eqkxi.ondigitalocean.app/loginUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }, body: JSON.stringify({ username: loginUsernameForm.value, password: loginPasswordForm.value })
    })

        .then(response => response.json())



        .then(data => {
            console.log(data);
            if (data.username === loginUsernameForm.value && data.password === loginPasswordForm.value)
                alert(data.username + " har loggat in")
            else alert("Fel uppgifter")

        })
}

function createUser() {
    fetch("https://dolphin-app-eqkxi.ondigitalocean.app/createUser", {
        method: "POST",
        headers: {


            "Content-Type": "application/json",
        }, body: JSON.stringify({ username: createUserNameForm.value, password: createPasswordForm.value })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.username + " är skapad")

        })
}