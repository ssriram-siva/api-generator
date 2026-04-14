import { useState } from "react";
import CodeViewer from "./components/CodeViewer";
import "./App.css";

export default function App() {
  const [apiName, setApiName] = useState("");
  const [fields, setFields] = useState("");
  const [mode, setMode] = useState("crud");
  const [method, setMethod] = useState("POST");
  const [route, setRoute] = useState("/");
  const [result, setResult] = useState(null);

  // 🔵 FEEDBACK STATES
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔵 GENERATE API
  const generate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiName,
          mode,
          method,
          route,
          fields: fields.split(",").map(f => f.trim())
        })
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Backend error");
    }
  };

  // 🔵 SEND FEEDBACK
  const sendFeedback = async () => {
    setLoading(true);
    setFeedbackStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, message })
      });

      const data = await res.json();

      if (data.success) {
        setFeedbackStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setFeedbackStatus("error");
      }
    } catch {
      setFeedbackStatus("server");
    }

    setLoading(false);

    // auto hide after 3 sec
    setTimeout(() => setFeedbackStatus(""), 3000);
  };

  return (
    <div className="container">

      {/* LEFT */}
      <div className="left">
        <h2>Backend Generator 🚀</h2>

        <input
          className="input"
          placeholder="API Name (users)"
          value={apiName}
          onChange={e => setApiName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Fields (name,email)"
          value={fields}
          onChange={e => setFields(e.target.value)}
        />

        <select className="input" onChange={e => setMode(e.target.value)}>
          <option value="crud">CRUD</option>
          <option value="single">Single API</option>
          <option value="custom">Custom Route</option>
        </select>

        {mode !== "crud" && (
          <select className="input" onChange={e => setMethod(e.target.value)}>
            <option>POST</option>
            <option>GET</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        )}

        {mode === "custom" && (
          <input
            className="input"
            placeholder="Route (/login)"
            value={route}
            onChange={e => setRoute(e.target.value)}
          />
        )}

        <button className="button" onClick={generate}>
          Generate Code
        </button>

        {/* 🔥 FEEDBACK */}
        <div className="section">
          <h3>Feedback 💬</h3>

          <input
            className="input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            className="input"
            placeholder="Your Feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <button
            className="button"
            onClick={sendFeedback}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Feedback"}
          </button>

          {/* 🔥 STATUS MESSAGE */}
          {feedbackStatus === "success" && (
            <p className="success-msg">✅ Feedback sent successfully!</p>
          )}

          {feedbackStatus === "error" && (
            <p className="error-msg">❌ Failed to send feedback</p>
          )}

          {feedbackStatus === "server" && (
            <p className="error-msg">⚠️ Server error</p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        {result ? (
          <>
            <CodeViewer title="server.js" code={result.server} />
            <CodeViewer title="routes.js" code={result.routes} />
          </>
        ) : (
          <p>Generated code will appear here...</p>
        )}
      </div>

    </div>
  );
}