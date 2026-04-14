import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeViewer({ title, code }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{title}</h4>

        <button className="copy-btn" onClick={copyCode}>
          {copied ? "✅ Copied" : "📋 Copy"}
        </button>
      </div>

      {/* 🔥 SCROLL FIX */}
      <div className="code-wrapper">
        <SyntaxHighlighter
          language="javascript"
          style={okaidia}
          wrapLongLines={false} // ❌ disable wrapping
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 16
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}