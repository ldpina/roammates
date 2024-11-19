import { StrictMode } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';  
import Home from './home';
import CreateNewPost from './createNewPost';  
import PostDetails from './postDetails';  
import EditPost from './editPost'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />  
          <Route path="create-new-post" element={<CreateNewPost />} />
          <Route path="post/:postId" element={<PostDetails />} />
          <Route path="/edit/:postId" element={<EditPost />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
