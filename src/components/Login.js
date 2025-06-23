// BloggerAuth.js
import React, { useEffect } from 'react';

const BloggerAuth = () => {
  const CLIENT_ID = '367082999316-d95b4as5aelct77beueglegpvf7i910c.apps.googleusercontent.com';

  useEffect(() => {
    const initializeGoogle = () => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/blogger',
        callback: (tokenResponse) => {
          console.log('Access Token:', tokenResponse.access_token);

          // Save token for later use
          localStorage.setItem('blogger_token', tokenResponse.access_token);

          // Example: Get blog by URL
          fetch(`https://www.googleapis.com/blogger/v3/blogs/byurl?url=https://abgdh.blogspot.com`, {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          })
            .then(res => res.json())
            .then(data => console.log('Blog Info:', data))
            .catch(err => console.error(err));
        },
      }).requestAccessToken();
    };

    // Load Google Identity script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h3>Blogger OAuth</h3>
      <p>Check the console for OAuth results and Blogger blog data.</p>
    </div>
  );
};

export default BloggerAuth;
