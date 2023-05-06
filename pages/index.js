import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { httpPost } from "./api/services/http-post";

export default function Home() {
  console.log("Starting Home");
  const [roleInput, setRoleInput] = useState("user");
  const [contentInput, setContentInput] = useState("Crea un codigo que llame al api de twitter y cree un tweet diciendo hello world");
  let [result, setResult] = useState([]);

  async function callGenerator(role, content) {
    const url = "/api/generate";
    return await httpPost(url, { role, content });
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const data = await callGenerator(roleInput, contentInput);
      console.log(data);
      setResult(data.result);
      setContentInput("");
      setRoleInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI JM Playground</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Enter a prompt</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="role"
            placeholder="role..."
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          />
          <input
            type="text"
            name="content"
            placeholder="content..."
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
          />
          <input type="submit" value="Push Message" />
        </form>
          <div className={styles.result}>
            {result.slice(0).reverse().map((r, i) => <p key={i}>{r.role}: {r.content}</p>)}
          </div>
      </main>
    </div>
  );
}
