import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from './client';
import './home.css';
import { timeAgo } from './utils';
import upvoteIcon from './icons/upvote.png';


function Home() {
  const { searchQuery } = useOutletContext();  
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); 

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);  
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes; 
    } else if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at); 
    }
    return 0;  
  });

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="homeContainer">
      <div className="sortControls">
        <label htmlFor="sortBy">Sort by:</label>
        <select id="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="newest">Newest</option>
          <option value="upvotes">Upvotes</option>
        </select>
      </div>

      <div className="postList">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="postLink">
              <div className="postCard">
                <p className="timestamp">Posted {timeAgo(post.created_at)}</p>
                <div className="titleUpvote">
                  <h2>{post.title}</h2>
                  <img className="upvoteButton" src={upvoteIcon} alt="Upvote Icon" />
                  <p className="upvoteCount">{post.upvotes}</p>
                </div>
                <img src={post.img} className="postImage" />
              </div>
            </Link>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}

export default Home;

