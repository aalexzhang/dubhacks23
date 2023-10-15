import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import "bulma/css/bulma.min.css";
import onSubmit from "./api/generate";
import { characters } from "./api/characters";
import Image from 'next/image'
import lily from '../public/lily.png'
import john from '../public/john.png'
import styles from "./index.module.css";
// import aurelio from '../public/aurelio.png'
// import kai from '../public/kai.png'
// import sakura from '../public/sakura.png'
// import rajesh from '../public/rajesh.png'
// import andres from '../public/andres.png'
// import amina from '../public/amina.png'


export default function Home() {
  const images = {"lily":lily, "john":john} //"aurelio":aurelio, "kai":kai, "sakura":sakura, "rajesh":rajesh, "andres":andres, "amina":amina}
  const [aiLoading, setaiLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatState, setChatState] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [friends, setFriends] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [talk, setTalk] = useState(false);

  useEffect(() => {
    setCurrentScenarioIndex(0);
    setCurrentName("Lily");
  }, []);

  useEffect(() => {
    setResolved(false);
    setChatState((state) => []);
    setInputText("");
    setCurrentName(characters["characterProgression"][currentScenarioIndex]);
  }, [currentScenarioIndex]);

  const startConversation = async () => {
    setChatState([]);
    setaiLoading(true);
    try {
      var dummyChatState = [...chatState, { role: "user", content: "" }];
      setChatState(dummyChatState);
      console.log("chatState:" + chatState);
      console.log(`../public/${currentName.toLowerCase()}.png`);
      const data = await onSubmit(
        dummyChatState,
        currentName,
        currentScenarioIndex,
        talk
      ); // Call onSubmit with the user's input
      console.log(data);
      dummyChatState = [
        ...dummyChatState,
        { role: "assistant", content: data },
      ];
      setChatState(dummyChatState);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setaiLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputText.trim() === "") {
      return;
    }
    setaiLoading(true);
    try {
      var dummyChatState = [
        ...chatState,
        { role: "user", content: inputText.trim() },
      ];
      setChatState(dummyChatState);
      console.log("chatState:" + chatState);
      let data = await onSubmit(
        dummyChatState,
        currentName,
        currentScenarioIndex,
        talk
      ); // Call onSubmit with the user's input

      if (data.includes("RESOLVED")) {
        data = data.replace("RESOLVED", "");
        setFriends([...friends, currentName]);
        setResolved(true);
      }

      dummyChatState = [
        ...dummyChatState,
        { role: "assistant", content: data },
      ];
      setChatState(dummyChatState);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setInputText("");
    setaiLoading(false);
  };

  useEffect(() => {
    const start = async () => {
      if (talk && currentName !== "" && chatState.length == 0 && !resolved) {
        await startConversation();
      }
    };
    start();
  }, [talk]);

  const handleContactBook = async (e) => {
    const friend = e.target.value;
    if (characters["characterProgression"].includes(friend)) {
      console.log("ENTERING TALK MODE");
      setCurrentName(friend);
      setTalk(true);
      setChatState((chatState) => []);
      setInputText("");
    } else {
      console.log("NO TALKING");
      setTalk(false);
      setChatState((state) => []);
      setInputText("");
      setCurrentName(characters["characterProgression"][currentScenarioIndex]);
    }
  };

  return (
    <div>
      <Head>
        <title>Sprouts!</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main>
        <div className={`modal ${resolved ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="message">
              <div className="message-body">
                Congrats! You solved {currentName}'s problem! You may now select
                them on your contact book on the right and talk with them
              </div>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setCurrentScenarioIndex((i) => i + 1)}
          ></button>
        </div>
        <div className="columns">
          <aside className="column hero is-2">
            <div className="container p-2">
              <p className="is-size-5 has-text-weight-bold">Contact List</p>
              {friends.length == 0 ? (
                <p>No Friends just yet!</p>
              ) : (
                <div className="select">
                  <select onChange={handleContactBook}>
                    <option>Select a Friend (game)</option>
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
              {!resolved && chatState.length == 0 && (
                <button onClick={startConversation}>Start Conversation</button>
              )}
            </div>


            <div className="container">
              <Image src={images[currentName.toLowerCase()]} className={styles.animated_element}/>
            </div>


            <div
              className="p-4 is-justify-content-flex-end is-flex is-flex-direction-column is-small"
              style={{ maxHeight: "400px" }}
            >
              <p className="title">Chat</p>
              <div
                className="p-2"
                style={{
                  maxHeight: "500px",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                <div>
                  {chatState
                    .filter((m) => m.content !== "")
                    .map((m, i) => {
                      const msgClass = m.role === "assistant"; // for demo purposes, format every other msg
                      return (
                        <p
                          style={{
                            textAlign: msgClass ? "left" : "right",
                            height: "auto",
                          }}
                        >
                          <span
                            key={i}
                            className={`tag is-medium p-2 ${
                              msgClass ? "is-success" : "is-info"
                            }`}
                            style={{
                              maxWidth: "500px",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                              height: "auto",
                            }}
                          >
                            {m.content}
                          </span>
                        </p>
                      );
                    })}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className={`input ${
                        inputText.trim() === "" ? "is-danger" : ""
                      }`}
                      type="text"
                      placeholder="How would you respond?"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={chatState.length === 0 || aiLoading || resolved}
                    />
                  </div>
                  <div className="control">
                    <a
                      className="button is-success"
                      onClick={handleSubmit}
                      disabled={
                        chatState.length === 0 ||
                        aiLoading ||
                        inputText.trim().length === 0
                      }
                    >
                      Submit
                    </a>
                  </div>
                </div>
                {inputText.trim().length === 0 && (
                  <p className="help is-danger">Type out your solution!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
