
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

  const [showPostPanel, setShowPostPanel] = useState(false);
  const [postBlogUrl, setPostBlogUrl] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postVerified, setPostVerified] = useState(false);
  const [postStatusMsg, setPostStatusMsg] = useState("");
  const [blogId, setBlogId] = useState("");

  const resetAllState = () => {
    setShowRulePanel(false);
    setBlogUrl("");
    setRulesText("");
    setStatusMsg("");
    setIsVerified(false);

    setShowPostPanel(false);
    setPostBlogUrl("");
    setPostTitle("");
    setPostContent("");
    setPostVerified(false);
    setPostStatusMsg("");
    setBlogId("");
  };

  const handleVerifyOwnership = async () => {
    if (!blogUrl) return alert("Please enter a blog URL.");

    let formattedUrl = blogUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = "https://" + formattedUrl;

    try {
      const response = await fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      const normalizedInputUrl = new URL(formattedUrl).hostname.toLowerCase();

      const ownsBlog = data.items.some(
        (blog) => new URL(blog.url).hostname.toLowerCase() === normalizedInputUrl
      );

      if (ownsBlog) {
        setStatusMsg("✅ Verified! You are the admin of this blog.");
        setIsVerified(true);
        const backendResponse = await fetch("https://blogcheck-backend.vercel.app/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blogUrl: formattedUrl }),
        });
        const backendData = await backendResponse.json();
        setRulesText(backendData.rules || "");
        setStatusMsg("✅ Rules loaded. You can edit them below.");
      } else {
        setStatusMsg("❌ You are not an admin of this blog.");
        setIsVerified(false);
      }
    } catch (error) {
      setStatusMsg("❌ Verification error: " + error.message);
      setIsVerified(false);
    }
  };

  const handleSaveRules = async () => {
    if (!isVerified || !rulesText.trim()) return;

    try {
      const response = await fetch("https://blogcheck-backend.vercel.app/rules_save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogUrl, rules: rulesText }),
      });
      setStatusMsg("✅ Rules saved successfully.");
      setTimeout(resetAllState, 1000);
    } catch (error) {
      setStatusMsg("❌ Failed to save rules: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center p-8 text-gray-200">
      {/* Cards container centered vertically and horizontally */}
      <div className="flex gap-10 mb-16">
        {/* Make Rules Card */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-64 flex flex-col items-center">
          <button
            onClick={() => {
              setShowRulePanel(true);
              setShowPostPanel(false);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition mb-4 w-full"
          >
            Make Rules
          </button>
          <ul className="list-disc list-inside text-gray-300 text-sm">
            <li>Verify blog ownership</li>
            <li>View existing posting rules</li>
            <li>Edit and save custom rules</li>
          </ul>
        </div>

        {/* Post Blog Card */}
        <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-64 flex flex-col items-center">
          <button
            onClick={() => {
              setShowPostPanel(true);
              setShowRulePanel(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition mb-4 w-full"
          >
            Post Blog
          </button>
          <ul className="list-disc list-inside text-gray-300 text-sm">
            <li>Verify your blog</li>
            <li>Write blog posts</li>
            <li>Submit posts for moderation</li>
          </ul>
        </div>
      </div>

      {/* Rule Panel */}
      {showRulePanel && (
        <div className="max-w-2xl w-full bg-gray-800 shadow-lg rounded-xl p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6 text-white">Define Blog Rules</h2>
          <input
            type="text"
            placeholder="Blog URL"
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleVerifyOwnership}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-md mb-4 transition w-full"
          >
            Verify & Load Rules
          </button>
          <textarea
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            disabled={!isVerified}
            rows={6}
            className={`w-full bg-gray-900 border rounded-md p-3 mb-4 text-white placeholder-gray-500 focus:outline-none ${
              isVerified
                ? "border-gray-700 focus:ring-2 focus:ring-green-500"
                : "cursor-not-allowed border-gray-700"
            }`}
          />
          <button
            onClick={handleSaveRules}
            disabled={!isVerified}
            className={`w-full ${
              isVerified ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-green-300 cursor-not-allowed"
            } text-white font-semibold px-5 py-3 rounded-md transition`}
          >
            Save Rules
          </button>
          {statusMsg && <p className="mt-4 text-gray-300 whitespace-pre-line">{statusMsg}</p>}
        </div>
      )}

      {/* Post Panel */}
      {showPostPanel && (
        <div className="max-w-2xl w-full bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Post to Blog</h2>
          <input
            type="text"
            placeholder="Blog URL"
            value={postBlogUrl}
            onChange={(e) => setPostBlogUrl(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={async () => {
              let formattedUrl = postBlogUrl.trim();
              if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = "https://" + formattedUrl;
              const response = await fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              const data = await response.json();
              const normalizedInputUrl = new URL(formattedUrl).hostname.toLowerCase();
              const matchingBlog = data.items.find(
                (blog) => new URL(blog.url).hostname.toLowerCase() === normalizedInputUrl
              );
              if (matchingBlog) {
                setPostVerified(true);
                setPostStatusMsg("✅ Blog verified.");
                setBlogId(matchingBlog.id);
              } else {
                setPostVerified(false);
                setPostStatusMsg("❌ Not authorized for this blog.");
                setBlogId("");
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-md mb-4 transition w-full"
          >
            Verify Blog
          </button>

          {postVerified && (
            <>
              <input
                type="text"
                placeholder="Post Title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Post Content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={8}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={async () => {
                  const response = await fetch("https://blogcheck-backend.vercel.app/moderate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ blogUrl: postBlogUrl, title: postTitle, content: postContent }),
                  });
                  const result = await response.json();
                  if (result.allowed) {
                    await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ title: postTitle, content: postContent }),
                    });

                    setPostStatusMsg("✅ Post published!");
                    setTimeout(resetAllState, 1000);
                  } else {
                    setPostStatusMsg("❌ Post rejected by moderation.");
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-md transition"
              >
                Submit Post
              </button>
            </>
          )}
          {postStatusMsg && <p className="mt-4 text-gray-300 whitespace-pre-line">{postStatusMsg}</p>}
        </div>
      )}
    </div>
  );
}

export default User;


