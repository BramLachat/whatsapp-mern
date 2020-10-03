import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        axios.get("/messages/sync").then((response) => {
            setMessages(response.data);
        });
    }, []);

    useEffect(() => {
        var pusher = new Pusher("b0e6f7ee5d8ccbb227de", {
            cluster: "eu",
        });

        var channel = pusher.subscribe("messages");
        channel.bind("inserted", (newMessage) => {
            //alert(JSON.stringify(newMessage));
            setMessages([...messages, newMessage]);
        });

        //cleanup function:
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [messages]); // <== React Hook useEffect has a missing dependency: 'messages'.
    // Either include it or remove the dependency array. You can also do a functional
    // update 'setMessages(m => ...)' if you only need 'messages' in the 'setMessages'
    // call  react-hooks/exhaustive-deps

    console.log(messages);

    return (
        <div className="app">
            <div className="app__body">
                <Sidebar />
                <Chat />
            </div>
        </div>
    );
}

export default App;
