import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // phoneEmailListener function to handle phone.email callback
  function phoneEmailListener(userObj) {
    const user_json_url = userObj.user_json_url;

    // Send user_json_url to backend API
    fetch('/api/fetch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_json_url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUserData(data);
        }
      })
      .catch((err) => setError('Failed to fetch user data'));
  }

  // Make phoneEmailListener globally available
  if (typeof window !== 'undefined') {
    window.phoneEmailListener = phoneEmailListener;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>Phone Email Auth</title>
        <meta name="description" content="Phone number authentication with phone.email" />
      </Head>

      <main className="text-center p-4">
        <h1 className="text-3xl font-bold mb-6">Sign in with Phone</h1>
        
        {/* phone.email sign-in button */}
        <div 
          className="pe_signin_button" 
          data-client-id="YOUR_PHONE_EMAIL_CLIENT_ID"
        >
          <script src="https://www.phone.email/sign_in_button_v1.js" async></script>
        </div>

        {/* Display user data or error */}
        {userData && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <p><strong>Country Code:</strong> {userData.user_country_code}</p>
            <p><strong>Phone Number:</strong> {userData.user_phone_number}</p>
            <p><strong>First Name:</strong> {userData.user_first_name}</p>
            <p><strong>Last Name:</strong> {userData.user_last_name}</p>
            <p className="text-green-600">Login Successful!</p>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-600 rounded">
            <p>Error: {error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
