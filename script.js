const socket = new SockJS("https://dolphin-app-eqkxi.ondigitalocean.app/websocket");
// const socket = new SockJS("http://localhost:8080/websocket");
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
const schoolRoomBtn = document.getElementById("schoolBtn")
const familyMessageList = document.getElementById("familyMessageList")
const familyBtn = document.getElementById("familyBtn")


stompClient.connect({}, (frame) => {
    console.log("connected :)");
    stompClient.subscribe("/topic/greetings", (greeting) => {
        console.log(JSON.parse(greeting.body).content)

        let li = document.createElement("li");
        li.innerText = JSON.parse(greeting.body).content;
        messageList.appendChild(li)
        sendText.value = "";
    })

    stompClient.subscribe("/topic/chat", (chat) => {
        let messageData = JSON.parse(chat.body)
        let li = document.createElement("li");
        if (messageData.user === localStorage.getItem("loggedInUser") && messageData.user !== null) {
            li.classList.add("own-message")
        } else {
            li.classList.add("other-message")
        }
        li.innerText = "(" + messageData.user + ") " + messageData.chat;
        messageList.appendChild(li)
    })
})

function sendHello(name) {
    stompClient.send("/app/hello", {}, JSON.stringify({ "name": name }))
}

function sendMessage() {
    stompClient.send("/app/chat", {}, JSON.stringify({ "content": sendText.value, "user": localStorage.getItem("loggedInUser") }));
    saveMessage(sendText.value)
    sendText.value = "";
}

async function saveMessage(sendText) {
    //await fetch("http://localhost:8080/createChatMessage", {
    await fetch("https://dolphin-app-eqkxi.ondigitalocean.app/createChatMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow.Origin": "*",
        }, body: JSON.stringify({ user: localStorage.getItem("loggedInUser"), content: sendText })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

        })
}


familyBtn.addEventListener("click", () => {
    localStorage.setItem("currentRoom", "family"), getRoomMessages(), window.location.href = "family.html"
})


sendBtn.addEventListener("click", sendMessage);
sendText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

createUserBtn.addEventListener("click", () => {
    createUser();
})

loginUserBtn.addEventListener("click", () => {
    loginUser();
})

async function loginUser() {
    try {
        // await fetch("http://localhost:8080/loginUser", {
        await fetch("https://dolphin-app-eqkxi.ondigitalocean.app/loginUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }, body: JSON.stringify({ username: loginUsernameForm.value, password: loginPasswordForm.value })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert("Götte!")
                localStorage.removeItem("loggedInUser");
                localStorage.setItem("loggedInUser", data.username)
                loginUsernameForm.value = ""
                loginPasswordForm.value = "";
                sendHello(localStorage.getItem("loggedInUser"))
            })
    } catch {
        alert("Dude! Kass")
    }
}

function createUser() {
    // fetch("http://localhost:8080/createUser", {
    fetch("https://dolphin-app-eqkxi.ondigitalocean.app/createUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({ username: createUserNameForm.value, password: createPasswordForm.value })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.username + " är skapad")
            createUserNameForm.value = "";
            createPasswordForm.value = "";

        })
}

function getRoomMessages() {
    //fetch("http://localhost:8080/getRoomMessages", {
    fetch("https://dolphin-app-eqkxi.ondigitalocean.app/getRoomMessages", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }, body: localStorage.getItem("currentRoom")
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
}