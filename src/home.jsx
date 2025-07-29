import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from './client';
import './home.css';
import { timeAgo } from './utils';
import upvoteIcon from './icons/upvote.png';

function Home() {
  const { searchQuery } = useOutletContext();  
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [sortBy, setSortBy] = useState('newest'); 

  useEffect(() => {
    document.title = 'RoamMates';
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const validPosts = data.filter(post => post.user_id);
      const userIds = validPosts.map(post => post.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      } else {
        const profileMap = {};
        profileData.forEach(profile => {
          profileMap[profile.id] = profile;
        });
        setProfiles(profileMap);
      }

      setPosts(validPosts);
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
          sortedPosts.map((post) => {
            const profile = profiles[post.user_id];
            return (
              <Link to={`/post/${post.id}`} key={post.id} className="postLink">
                <div className="postCard">
                  <p className="timestamp">Posted {timeAgo(post.created_at)}</p>
                  {profile && (
                    <div className="postUserInfo">
                      <img src={profile.avatar_url} alt="avatar" className="postAvatar" />
                      <span className="postUsername">{profile.username}</span>
                    </div>
                  )}
                  <h2>{post.title}</h2>
                  {post.location && <p className="postLocation">{post.location}</p>}

                  <div className="imageWrapper">
                    <img src={post.img} className="postImage" />
                  </div>

                  <div className="titleUpvote">
                    <img className="upvoteButton" src={upvoteIcon} alt="Upvote Icon" />
                    <p className="upvoteCount">{post.upvotes}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}

export default Home;
