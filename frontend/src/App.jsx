import { useState } from "react";
import { API_BASE_URL } from "./config";

export default function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaste = async () => {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    const body = {
      content,
      ...(ttl && { ttl_seconds: Number(ttl) }),
      ...(maxViews && { max_views: Number(maxViews) }),
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(resultUrl);
    alert("Link copied!");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Pastebin Lite</h1>

        <textarea
          rows={8}
          placeholder="Paste your text here..."
          className="w-full border rounded-lg p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="TTL (seconds)"
            className="flex-1 border rounded-lg px-3 py-2"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max views"
            className="flex-1 border rounded-lg px-3 py-2"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button
          onClick={createPaste}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {resultUrl && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-700 mb-2">
              Paste created successfully
            </p>
            <div className="flex items-center gap-2">
              <a
                href={resultUrl}
                target="_blank"
                className="text-blue-600 underline break-all"
              >
                {resultUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className="text-sm bg-slate-200 px-2 py-1 rounded hover:bg-slate-300"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
