import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import "bulma/css/bulma.min.css";
import onSubmit from "./api/generate";
import { characters } from "./api/characters";
import Image from "next/image";
import lily from "../public/lily.png";
import john from "../public/john.png";
import styles from "./index.module.css";
import aurelio from "../public/aurelio.png";
import kai from "../public/kai.png";
import sakura from "../public/sakura.png";
import rajesh from "../public/rajesh.png";
import andres from "../public/andres.png";
import amina from "../public/amina.png";
import logo from "../public/logo.png";

export default function Home() {
  const images = {
    lily: lily,
    john: john,
    aurelio: aurelio,
    kai: kai,
    amina: amina,
    andres: andres,
    sakura: sakura,
    rajesh: rajesh,
  };
  const [aiLoading, setaiLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatState, setChatState] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [userName, setUserName] = useState("");
  const [setup, setSetup] = useState(true);
  const [friends, setFriends] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [talk, setTalk] = useState(false);
  const [beat, setBeat] = useState(false);

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
        talk,
        userName
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
        talk,
        userName
      ); // Call onSubmit with the user's input

      if (data.includes("RESOLVED") && !talk) {
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

  const beatGame = () => {
    setBeat(true);
    setCurrentName(characters["characterProgression"][0]);
    setTalk(true);
    setResolved(false);
    setChatState((state) => []);
    setInputText("");
  };

  const nextLevel = () => {
    if (
      currentScenarioIndex + 1 === characters["characterProgression"].length
    ) {
      beatGame();
    } else {
      setCurrentScenarioIndex((i) => i + 1);
    }
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
        <title>Sprout!</title>
      </Head>
      <main style={{ maxHeight: "100%", overflow: "hidden" }}>
        <div className={`modal ${resolved ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <div className="modal-card-head">
              <p className="modal-card-title is-bold has-text-weight-semibold">
                Problem Success! 🎉🎉🎉
              </p>
            </div>
            <section className="modal-card-body">
              <div className="content is-block">
                {currentScenarioIndex + 1 === characters["characterProgression"].length ? (
                  <p>
                    Very Impressive! By completing {currentName}'s problem, you
                    finished all scenarios. You may now talk to all your friends
                    freely!
                  </p>
                ) : (
                  <p>
                    Congrats! You solved {currentName}'s problem! You may now
                    select them on your contact book on the right and talk with
                    them
                  </p>
                )}
                <button
                  className="button is-success is-pulled-right"
                  onClick={() => nextLevel()}
                >
                  Close
                </button>
              </div>
            </section>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => nextLevel()}
          ></button>
        </div>
        <div className={`modal ${setup ? "is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <div className="modal-card-head">
              <p className="modal-card-title is-bold has-text-weight-semibold">
                Welcome to Sprout!
              </p>
            </div>
            <section className="modal-card-body">
              <div className="content is-block">
                <p>
                  Welcome to Sprout, a platform for kids to improve their social
                  skills through puzzle-based roleplays!
                </p>
                <p>Start by helping Lily 🪷 with her issue!</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSetup(false);
                  }}
                >
                  <label className="label">Enter your name:</label>
                  <div className="field has-addons">
                    <div className="control has-icons-left has-icons-right is-expanded">
                      <input
                        className={`input ${
                          userName !== "" ? "is-success" : "is-danger"
                        }`}
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.trim())}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user"></i>
                      </span>
                      <span className="icon is-small is-right">
                        <i
                          className={`fas ${
                            userName !== "" ? "fa-check" : "fa-xmark"
                          }`}
                        ></i>
                      </span>
                    </div>
                    <div className="control">
                      <a
                        className="button is-success"
                        onClick={() => setSetup(false)}
                        disabled={userName === ""}
                      >
                        Submit Name
                      </a>
                    </div>
                  </div>
                  {userName === "" && (
                    <p className="help is-danger">Provide your name</p>
                  )}
                </form>
              </div>
            </section>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setSetup(false)}
            disabled={userName === ""}
          ></button>
        </div>
        <nav className="navbar has-shadow">
          <div className="navbar-brand p-2">
            <a
              className="p-1"
              href="/"
              style={{ position: "relative", height: "50px", width: "180px" }}
            >
              <Image
                src={logo}
                alt="Sprout logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </a>
          </div>
          <div className="navbar-menu"></div>
          <div className="navbar-end"></div>
        </nav>
        <div
          className="columns"
          style={{ maxHeight: "100%", overflow: "hidden" }}
        >
          <aside
            className="column hero is-narrow"
            style={{
              backgroundColor: "#F9F9F9",
              borderRight: "1px solid #DEDEDE",
              width: "auto",
            }}
          >
            <div className="container pt-4">
              <div className="box ml-3">
                <p className="title is-size-4">Contact List</p>
                {friends.length == 0 ? (
                  <p>No Friends just yet!</p>
                ) : (
                  <div className="select">
                    <select onChange={handleContactBook}>
                      {!beat && <option>Select a Friend (game)</option>}
                      {friends.map((friend, i) => (
                        <option key={i}>{friend}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </aside>
          <div className="column hero is-flex is-fullheight-with-navbar">
            <div className="p-4">
              <p className="title">Playground</p>
              {!resolved && chatState.length == 0 && (
                <button className="button" onClick={startConversation}>
                  Help {currentName} with an issue!
                </button>
              )}
            </div>

            <div
              className="container"
              style={{ width: "100%", height: "auto", position: "relative" }}
            >
              <Image
                src={images[currentName.toLowerCase()]}
                alt={currentName}
                className={aiLoading ? styles.animated_element : ""}
                fill
                sizes="100vw"
                style={{ objectFit: "contain" }}
              />
            </div>

            <div
              className="box p-4 mr-3 mb-2 is-justify-content-flex-end is-flex is-flex-direction-column is-small"
              style={{ maxHeight: "400px", overflow: "hidden" }}
            >
              <p className="title mb-1">Chat</p>
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
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="field has-addons">
                  <div className="control has-icons-left has-icons-right is-expanded">
                    <input
                      className={`input ${
                        chatState.length > 0 &&
                        !aiLoading &&
                        inputText.trim() === ""
                          ? "is-danger"
                          : ""
                      }`}
                      type="text"
                      placeholder="How would you respond?"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={chatState.length === 0 || aiLoading || resolved}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-child"></i>
                    </span>
                    <span className="icon is-small is-right">
                      <i
                        className={`fas ${
                          inputText.trim().length !== 0
                            ? "fa-check"
                            : "fa-xmark"
                        }`}
                      ></i>
                    </span>
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
                {chatState.length > 0 &&
                  !aiLoading &&
                  inputText.trim().length === 0 && (
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
