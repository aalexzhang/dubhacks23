import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import "bulma/css/bulma.min.css";
import onSubmit from "./api/generate";

export default function Home() {
  const [aiLoading, setaiLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatState, setChatState] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [friends, setFriends] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState("");

  useEffect(() => {
    setCurrentName("John");
    setCurrentScenarioIndex(0);
  }, []);

  //On button press, change the input to some scenario and chatbot data
  const handleFetchData = async (input) => {
    try {
      const data = await onSubmit(input);
      console.log(data);
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  const startConversation = async () => {
    setaiLoading(true);
    try {
      var dummyChatState = [...chatState, {"role": "user", "content": ''}]
      setChatState(dummyChatState)
      console.log("chatState:" + chatState)
      const data = await onSubmit(dummyChatState, currentName, currentScenarioIndex); // Call onSubmit with the user's input
      console.log(data);
      dummyChatState = [...dummyChatState, {"role": "assistant", "content": data}]
      setChatState(dummyChatState)
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setaiLoading(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputText.trim() === '') {
      return
    }
    setaiLoading(true);
    try {
      var dummyChatState = [...chatState, {"role": "user", "content": inputText.trim()}]
      setChatState(dummyChatState)
      console.log("chatState:" + chatState)
      const data = await onSubmit(dummyChatState, currentName, currentScenarioIndex); // Call onSubmit with the user's input
      console.log(data);
      dummyChatState = [...dummyChatState, {"role": "assistant", "content": data}]
      setChatState(dummyChatState)
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setaiLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Sprouts!</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main>
        <div className="columns">
          <aside className="column hero is-2">
            <div className="container p-2">
              <p className="is-size-5 has-text-weight-bold">Contact List</p>
              {friends.length == 0 ? (
                <p>No Friends just yet!</p>
              ) : (
                <div className="select">
                  <select>
                    <option>Select a Friend</option>
                    {friends.map((friend, i) => (
                      <option key={i}>{friend}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </aside>
          <div className="column hero is-fullheight is-flex">
            <div className="p-4">
              <p className="title">Playground</p>
              <p className="subtitle">Playground area</p>
              <button onClick={startConversation}>Start Conversation</button>
            </div>
            <div
              className="p-4 is-justify-content-flex-end is-flex is-flex-direction-column is-small"
              style={{ height: "400px" }}
            >
              <p className="title">Chat</p>
              <div className="p-2">
                {chatState.filter((m) => m.content !== '').map((m, i) => {
                  const msgClass = m.role === "assistant"; // for demo purposes, format every other msg
                  return (
                    <p
                      style={{
                        padding: ".25em",
                        textAlign: msgClass ? "left" : "right",
                        overflowWrap: "normal",
                        maxWidth: "100px"
                      }}
                    >
                      <span
                        key={i}
                        className={`tag is-medium ${
                          msgClass ? "is-success" : "is-info"
                        }`}
                      >
                        {m.content}
                      </span>
                    </p>
                  );
                })}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className={`input ${inputText.trim() === '' ? 'is-danger': ''}`}
                      type="text"
                      placeholder="How would you respond?"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={chatState.length === 0 || aiLoading}
                    />
                  </div>
                  <div className="control">
                    <a className="button is-success" onClick={handleSubmit} disabled={chatState.length === 0 || aiLoading || inputText.trim().length === 0}>Submit</a>
                  </div>
                </div>
                {
                    inputText.trim().length === 0 &&
                    <p className="help is-danger">Type out your solution!</p>
                  }
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
