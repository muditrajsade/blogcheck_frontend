
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const CLIENT_ID = "367082999316-d95b4as5aelct77beueglegpvf7i910c.apps.googleusercontent.com";
  const SCOPES = "https://www.googleapis.com/auth/blogger";
  const [tokenClient, setTokenClient] = useState(null);
  let n = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error("Token error:", tokenResponse);
            return;
          }
          let r = tokenResponse.access_token;
          n("/user", { state: { r } });
        },
      });
      setTokenClient(client);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLoginClick = () => {
    if (!tokenClient) {
      alert("Google API not initialized yet");
      return;
    }
    tokenClient.requestAccessToken();
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fadeSlideUp {
          animation: fadeSlideUp 0.8s ease forwards;
        }
        .fadeSlideUp-delay {
          animation: fadeSlideUp 0.8s ease forwards;
          animation-delay: 0.3s;
          animation-fill-mode: forwards;
          opacity: 0;
        }
        .pulse {
          animation: pulse 2.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(255, 255, 255, 0);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
        }
        /* Card hover lift */
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 15px 25px rgba(59, 130, 246, 0.4); /* Tailwind's blue-500 shadow */
          z-index: 10;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wide">BlogCheck</h1>
            <button
              onClick={handleLoginClick}
              className="bg-white text-black px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-300 pulse"
            >
              Login with Google
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center text-center px-4 py-24">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight fadeSlideUp">
            Simplify. Moderate. Publish.
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mb-16 fadeSlideUp-delay">
            Use AI-powered rules to check your blog’s tone, quality, and safety
            before publishing to Blogger. Create better content with confidence.
          </p>

          {/* Feature Cards Container */}
          <div className="flex flex-col sm:flex-row gap-8 max-w-5xl w-full justify-center">
            <div className="card bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer flex-1">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Smart Content Analysis</h3>
              <p className="text-gray-300">
                Automatically assess your blog posts for tone, grammar, and structure to ensure clarity and impact.
              </p>
            </div>

            <div className="card bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer flex-1">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Customizable Rules</h3>
              <p className="text-gray-300">
                Define your own moderation rules to keep your blog safe and aligned with your personal or brand values.
              </p>
            </div>

            <div className="card bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer flex-1">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Seamless Blogger Integration</h3>
              <p className="text-gray-300">
                Once approved, publish your content directly to your Blogger account without leaving the app.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;

