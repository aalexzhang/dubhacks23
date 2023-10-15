import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./index.module.css";
import onSubmit from "./api/generate";

export default function Home() {
  const [result, setResult] = useState();
  const [chatState, setChatState] = useState([]);
  const [currentName, setCurrentName] = useState("");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState("");


  useEffect(() => {
    setChatState([...chatState, {"role": "user", "content": "Hello."}, {"role": "assistant", "content": "Hello."},  {"role": "user", "content": "What is your name?"}]);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("asdf")
      const data = await onSubmit(chatState, currentName, currentScenarioIndex); // Call onSubmit with the user's input
      console.log(data);
      setResult(data);

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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
                    {friends.map((friend) => (
                      <option>{friend}</option>
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
            </div>
            <div
              className="p-4 is-justify-content-flex-end is-flex is-flex-direction-column is-small"
              style={{ height: "400px" }}
            >
              <p className="title">Chat</p>
              <div className="p-2">
                {
                    messages.map((m, i) => {
                        const msgClass = i === 0 || i % 2 === 0 // for demo purposes, format every other msg
                        return (
                          <p style={{ padding: '.25em', textAlign: msgClass ? 'left' : 'right', overflowWrap: 'normal' }}>
                            <span key={i} className={`tag is-medium ${msgClass ? 'is-success' : 'is-info'}`}>{m}</span>
                          </p>
                        )}
                    )
                }
              </div>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    placeholder="How would you respond?"
                  />
                </div>
                <div className="control">
                  <a className="button is-success">Submit</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
