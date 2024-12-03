import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { supabase } from './client';
import './postDetails.css';
import { timeAgo } from './utils';
import upvoteIcon from './icons/upvote.png';
import editIcon from './icons/edit.png';
import deleteIcon from './icons/delete.png';


function PostDetails() {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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


    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false }); 

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data); 
      }
    };

    fetchPost();
    fetchComments();
  }, [postId]); 

  const handleUpvote = async () => {
    const { data, error } = await supabase
    .from('posts')
    .update({ upvotes: post.upvotes + 1 })
    .eq('id', post.id);

    if (error) {
    console.error('Error upvoting post:', error);
    } else {
    setPost({ ...post, upvotes: post.upvotes + 1 });
    }
};

const handleDelete = async () => {
    try {
      
      // first delete the comments
      const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', post.id);  
  
      if (deleteCommentsError) {
        throw deleteCommentsError; 
      }
  
      // Now delete the post
      const { error: deletePostError } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id); 
  
      if (deletePostError) {
        throw deletePostError; 
      }

      alert('Post has been successfully deleted!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post and comments:', error);
    }
  };
  

  const handleCommentChange = (e) => {
    setNewComment(e.target.value); 
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
  
    if (newComment.trim()) {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            comment_text: newComment,
          },
        ]);
  
      if (error) {
        console.error('Error adding comment:', error);
      } else {
        setNewComment('');
  
        // Refetch comments after adding a new one
        const { data: newComments, error: fetchError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: false });
  
        if (fetchError) {
          console.error('Error fetching comments after adding:', fetchError);
        } else {
          // Update the comments state with the latest data from Supabase
          setComments(newComments);
        }
      }
    }
  };

  if (!post) return <div>Loading...</div>; // this is to ensure all data is loaded together

  return (
    <div className="postDetails">
        <p>Posted: {timeAgo(post.created_at)}</p>
        <div className="titleUpvote">
            <button onClick={handleUpvote} className="upvoteButton">
             <img className="upvoteIcon" src={upvoteIcon} alt="Upvote" />
            </button>
            <p className="postUpvotes">{post.upvotes}</p>
            <h1>{post.title}</h1>
            <button className="editButton">
                <Link to={`/edit/${post.id}`}>
                <img className="editIcon" src={editIcon} alt="Edit" />
                </Link>
            </button>
            <button onClick={handleDelete} className="deleteButton">
              <img className="deleteIcon" src={deleteIcon} alt="Delete" />
            </button>
        </div>
        
        {post.img && <img src={post.img} alt="Post" className="postImage" />}

      <p>{post.content}</p>

      <div className="commentSection">
        <h3>Comments</h3>
        <form onSubmit={handleAddComment}>
          <textarea value={newComment} onChange={handleCommentChange} placeholder="Write a comment..." rows="2" className="commentInput"
          />
          <button type="submit" className="commentButton">Post Comment</button>
        </form>

        <div className="commentsList">
          {comments.map((comment) => (
            <div key={comment.id} className="commentCard">
              <p className="commentText">{comment.comment_text}</p>
              <span className="commentDate">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;

