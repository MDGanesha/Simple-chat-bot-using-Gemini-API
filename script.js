const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

let API_KEY = "AIzaSyB6zEgZfImoSNVEKJiJJfcoz7usYqQCfxI";
let API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingMessage();
});

const handleChatList = (html, ...content) => {
    let div = document.createElement("div");
    div.className = [...content];
    div.innerHTML = html;
    return div;
};

let handleOutgoingMessage = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();

    if (!userMessage) return;

    let html = `
                <div class="message-content">
                    <img src="https://media.licdn.com/dms/image/v2/D4D03AQHkJ_ePv5ksLQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715070765302?e=1731542400&amp;v=beta&amp;t=t77gcmv68n0HxH-f902G1AySQidfJboeINd4B_8BIkc"  alt="Ganesha MD"  class="avtar">
                    <p class="text">${userMessage}
                    </p>
                </div>`;

    let outgoingMessage = handleChatList(html, "outgoing", "loading");
    chatList.append(outgoingMessage);
    handleIncommingMessage();
};
let incommingMessage = null;
const handleIncommingMessage = () => {
    let html = `<div class="message-content">
                    <img
                        src="image/gemini.svg"
                        alt="User Image"
                        class="avtar"
                    />
                    <p class="text">
                    </p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>`;
    incommingMessage = handleChatList(html, "incomming");
    generateResponse(userMessage);
};

const generateResponse = async (userMessage) => {
    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: userMessage,
                            },
                        ],
                    },
                ],
            }),
        });

        let data = await response.json();
        console.log(await data.suggestions); // Corrected 'suggestoins' to 'suggestions'

        console.log(data.candidates[0].content.parts[0].text);
        incommingMessage.querySelector(".text").innerText = String(
            data.candidates[0].content.parts[0].text
        ).replace("*", "");
        chatList.append(incommingMessage);
    } catch (error) {
        console.log(error);
    } finally {
        typingForm.querySelector(".typing-input").value = "";
        incommingMessage.querySelector(".loading-indicator").innerHTML = "";
    }
};

let typingArea = document.querySelector(".typing-area");

let deleteButton = typingArea.querySelector(".action-buttons");

deleteButton.addEventListener("click", () => {
    chatList.innerHTML = "";
});

const suggestionsList = document.querySelector(".suggetions-list");
const suggestions = suggestionsList.querySelectorAll(".suggestion");

suggestions.forEach((element) => {
    element.addEventListener("click", () => {
        let msg = element.querySelector(".text");
        let html = `
                <div class="message-content">
                    <img src="https://media.licdn.com/dms/image/v2/D4D03AQHkJ_ePv5ksLQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715070765302?e=1731542400&amp;v=beta&amp;t=t77gcmv68n0HxH-f902G1AySQidfJboeINd4B_8BIkc"  alt="Ganesha MD"  class="avtar">
                    <p class="text">${msg.innerText}
                    </p>
                </div>`;

        let outgoingMessage = handleChatList(html, "outgoing", "loading");
        chatList.append(outgoingMessage);
        generateResponse(msg.innerText);
    });
});
