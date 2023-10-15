import Head from "next/head";
import { useState } from "react";
import "bulma/css/bulma.min.css";
import { characters } from "./api/characters";

export default function Home() {
  const chars = Object.keys(characters).map((key) => characters[key]);

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(chars[0].name);
  const [messages, setMessages] = useState(['Hello', 'Whats up', 'YOOOO']);

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
