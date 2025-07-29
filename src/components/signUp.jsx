import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import defaultAvatar from '../icons/default-profile-pic.png';


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fusername, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();
  setError('');

  if (!firstName || !lastName || !fusername || !email || !password) {
    setError('Please fill out all required fields.');
    return;
  }

  // Step 1: Check if username is already taken
  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', fusername);

  if (checkError) {
    setError('Error checking username. Please try again.');
    return;
  }

  if (existingUsers.length > 0) {
    setError('Username already taken. Please choose a different one.');
    return;
  }

  // Step 2: Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    setError(signUpError.message);
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    setError('Session not ready. Please try again.');
    return;
  }

  const userId = session.user.id;
  let profilePicUrl = '';

  // Step 3: Upload or use default avatar
  if (profilePic) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pics')
      .upload(`avatars/${userId}/${profilePic.name}`, profilePic, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('profile-pics')
      .getPublicUrl(uploadData.path);

    profilePicUrl = publicUrlData.publicUrl;
  } else {
    const { data: defaultUrl } = supabase
      .storage
      .from('profile-pics')
      .getPublicUrl('defaults/default-profile-pic.png');

    profilePicUrl = defaultUrl.publicUrl;
  }

  // Step 4: Insert user profile
  const { error: insertError } = await supabase.from('profiles').insert([
    {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      username: fusername,
      avatar_url: profilePicUrl,
    },
  ]);

  if (insertError) {
    setError('Failed to complete profile creation. Please contact support.');
    return;
  }

  navigate('/home');
};


  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={fusername}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
      <label>
        Upload Profile Picture (optional):
        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
          accept="image/*"
        />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
