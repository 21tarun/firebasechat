import './App.css';
import React, { useState, useEffect } from "react";
import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, off, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDIRm_YZ7TdS-xDtJD5zr0mmNvBsOcGowY",
  authDomain: "chat-app-f12a6.firebaseapp.com",
  projectId: "chat-app-f12a6",
  storageBucket: "chat-app-f12a6.appspot.com",
  messagingSenderId: "710621969595",
  appId: "1:710621969595:web:73e8a64a25c7aa57f33d9e",
  measurementId: "G-QY75HH4X8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, "messages");

    const onDataChange = (snapshot) => {
      const messagesData = snapshot.val();
      const messagesArray = [];

      for (let key in messagesData) {
        messagesArray.push({ id: key, text: messagesData[key].text });
      }

      setMessages(messagesArray);
    };

    onValue(messagesRef, onDataChange);

    return () => {
      off(messagesRef, onDataChange);
    };
  }, [database]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (newMessage.trim() !== "") {
      const messagesRef = ref(database, "messages");
      push(messagesRef, { text: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
