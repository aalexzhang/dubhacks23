import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./index.module.css";
import onSubmit from "./api/generate";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  //On page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await onSubmit("");
        console.log(data);
        setResult(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await onSubmit(animalInput);
      console.log(data);
      setResult(data);
      setAnimalInput("");
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
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
