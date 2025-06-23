import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const CLIENT_ID = "367082999316-d95b4as5aelct77beueglegpvf7i910c.apps.googleusercontent.com";
  const SCOPES = "https://www.googleapis.com/auth/blogger";

  const [tokenClient, setTokenClient] = useState(null);
  

  let n = useNavigate();

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      // Initialize the token client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error("Token error:", tokenResponse);
            return;
          }
          console.log("Access Token:", tokenResponse.access_token);

          let r = tokenResponse.access_token

          n('/user', { state: { r } });
         

          // Now you can call Blogger API with this access token!
          
        },
      });
      setTokenClient(client);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Called when user clicks your login button
  const handleLoginClick = () => {
    if (!tokenClient) {
      alert("Google API not initialized yet");
      return;
    }
    tokenClient.requestAccessToken();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">BlogCheck</div>
          <button
            onClick={handleLoginClick}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            Login with Google
          </button>
        </div>
      </header>

      <main className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-8">Welcome to BlogCheck</h1>
          <p className="text-lg mb-8">
            We help you analyze and assess the quality of blogs. Check if your
            blog meets the standards of the blogosphere!
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
