const socket = new SockJS("https://dolphin-app-eqkxi.ondigitalocean.app/websocket");
const messageList = document.getElementById("messageList")
const sendText = document.getElementById("sendText")
const sendBtn = document.getElementById("sendBtn")
const loginForm = document.getElementById("loginForm")
const loginBtn = document.getElementById("loginBtn")

const stompClient = new Stomp.over(socket);

stompClient.connect({},(frame) => {
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
    stompClient.send("/app/hello", {}, JSON.stringify({"name": name}))
}

sendBtn.addEventListener("click", () => {
    stompClient.send("/app/chat", {}, JSON.stringify({"content": sendText.value}))
    sendText.innerHTML="";
})

loginBtn.addEventListener("click", () => {
    console.log("loggar in")
})

function login() {
    
}