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
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={chatState}
            onChange={(e) => setChatState(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
