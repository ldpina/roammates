import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { supabase } from './client'; 
import './editPost.css';

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate(); 
  const [post, setPost] = useState({
    title: '',
    content: '',
    img: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data); 
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: post.title,
        content: post.content,
        img: post.img,
      })
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      alert('Post updated successfully!');
      navigate('/'); 
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="editPostContainer">
      <h1>Edit Post</h1>
      <form className="editPostForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="img">Image URL:</label>
          <input
            type="text"
            id="img"
            name="img"
            value={post.img}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submitBtn">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
