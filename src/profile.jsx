import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './client';
import ImageCropper from './ImageCropper';
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setError('Failed to load profile.');
      } else {
        setProfile(data);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCroppingImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImageUpload = async (croppedBlob) => {
  const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });

  // ✅ Ensure consistent file path
  const filePath = `avatars/${user.id}/profile.jpg`;

  // ✅ Upload image
  const { data, error } = await supabase.storage
    .from('profile-pics')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error("❌ Upload Error:", error);
    setError('Upload failed: ' + error.message);
    return;
  }

  // ✅ Get public URL with cache-busting timestamp
  const { data: publicUrlData } = supabase
    .storage
    .from('profile-pics')
    .getPublicUrl(filePath);

  const newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`; // prevent browser cache

  // ✅ Update DB with new avatar URL
  await supabase
    .from('profiles')
    .update({ avatar_url: newAvatarUrl })
    .eq('id', user.id);

  // ✅ Update local state
  setProfile((p) => ({ ...p, avatar_url: newAvatarUrl }));
  setCroppingImage(null);
};  

  if (!user || !profile) return <div>Loading...</div>;

  return (
    <div className="profileContainer">
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile.avatar_url && (
        <img src={profile.avatar_url} alt="Profile" className="avatar" />
      )}
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>

      <label>
        Change Profile Picture:
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      </label>

      {croppingImage && (
        <ImageCropper imageSrc={croppingImage} onSave={handleCroppedImageUpload} />
      )}

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default Profile;
