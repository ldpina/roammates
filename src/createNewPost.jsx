import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './client';  
import './createNewPost.css'; 

function CreateNewPost() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImg, setPostImg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('posts')  
        .insert([
          {title:postTitle, content:postContent, img:postImg}
        ]);

      if (error) throw error;

      console.log('Post submitted successfully:', data);
      navigate('/');  
    } catch (err) {
      console.error('Error submitting post:', err);
      setError('Failed to submit post, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createPostContainer">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="createPostForm">
        <label>
          Title:
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            value={postImg}
            onChange={(e) => setPostImg(e.target.value)}
            placeholder='optional'
            
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Post'}
        </button>
      </form>
    </div>
  );
}

export default CreateNewPost;

