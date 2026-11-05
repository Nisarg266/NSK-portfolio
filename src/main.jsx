import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="site-frame" aria-label="NSK Studio Tech website">
      <iframe
        title="NSK Studio Tech original website experience"
        src="/original-site/index.html"
        allow="autoplay; fullscreen; picture-in-picture"
        loading="eager"
      />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
