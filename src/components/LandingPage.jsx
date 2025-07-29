import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const userId = sessionData.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      setError("Signed in, but couldn't fetch profile info.");
      return;
    }

    // Optionally store profile in localStorage
    localStorage.setItem('username', profile.username);
    localStorage.setItem('firstName', profile.first_name);
    localStorage.setItem('lastName', profile.last_name);
    localStorage.setItem('avatarUrl', profile.avatar_url ?? '');

    navigate('/home');
  };

  return (
    <div className="landingContainer">
      <h1>Welcome to RoamMates</h1>
      <h3>Connect with travelers and discover breathtaking experiences</h3>

      <form onSubmit={handleSignIn} className="signInForm">
        <h2>Sign In</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <p>Don't have an account? <button onClick={() => navigate('/signup')}>Sign Up</button></p>
    </div>
  );
}

export default LandingPage;
