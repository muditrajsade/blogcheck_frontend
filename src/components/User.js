import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function User() {
  const location = useLocation();
  const accessToken = location.state?.r;

  const [showRulePanel, setShowRulePanel] = useState(false);
  const [blogUrl, setBlogUrl] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyOwnership = async () => {
    if (!blogUrl) {
      alert("Please enter a blog URL.");
      return;
    }

    let formattedUrl = blogUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      // Verify ownership as before
      const response = await fetch(
        "https://www.googleapis.com/blogger/v3/users/self/blogs",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user blogs");
      }

      const data = await response.json();

      // Normalize entered blog URL hostname
      const normalizedInputUrl = new URL(formattedUrl).hostname.toLowerCase();

      const ownsBlog = data.items.some(
        (blog) => new URL(blog.url).hostname.toLowerCase() === normalizedInputUrl
      );

      if (ownsBlog) {
        setStatusMsg("✅ Verified! You are the admin of this blog.");
        setIsVerified(true);

        // Now check if rules exist on backend for this blog
        const backendResponse = await fetch("http://localhost:8000/rules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogUrl: formattedUrl }),
        });

        if (!backendResponse.ok) {
          throw new Error("Failed to check rules from backend");
        }

        const backendData = await backendResponse.json();

        if (backendData.exists) {
          setRulesText(backendData.rules);
          setStatusMsg("✅ Rules loaded. You can edit them below.");
        } else {
          setRulesText("");
          setStatusMsg(
            "No rules found for this blog. Please enter rules and save."
          );
        }
      } else {
        setStatusMsg("❌ Verification failed: You are not an admin of this blog.");
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatusMsg("❌ Verification failed: " + error.message);
      setIsVerified(false);
    }
  };

  const handleSaveRules = async () => {
    if (!isVerified) {
      alert("Please verify ownership first.");
      return;
    }
    if (!rulesText.trim()) {
      alert("Rules cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogUrl: blogUrl, rules: rulesText }),
      });

      if (!response.ok) {
        throw new Error("Failed to save rules.");
      }

      setStatusMsg("✅ Rules saved successfully.");
    } catch (error) {
      console.error("Save rules error:", error);
      setStatusMsg("❌ Failed to save rules: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowRulePanel(!showRulePanel)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Make Rules
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Post Blog
        </button>
      </div>

      {showRulePanel && (
        <div className="bg-white shadow p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Define Blog Rules</h2>

          <input
            type="text"
            placeholder="Enter blogspot URL (e.g., https://yourblog.blogspot.com)"
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          <button
            onClick={handleVerifyOwnership}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Verify Ownership & Load Rules
          </button>

          <textarea
            placeholder="Enter your rules for allowed blog posts..."
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            className="w-full border p-2 mb-4 h-32 rounded"
            disabled={!isVerified}
          />

          <button
            onClick={handleSaveRules}
            className={`px-4 py-2 rounded text-white ${
              isVerified ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isVerified}
          >
            Save Rules
          </button>

          {statusMsg && (
            <div className="mt-4 text-sm text-gray-700">{statusMsg}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default User;
