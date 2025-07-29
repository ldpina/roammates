import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import LandingPage from './components/LandingPage';
import SignUp from './components/signUp';
import Home from './home';
import CreateNewPost from './createNewPost';
import PostDetails from './postDetails';
import EditPost from './editPost';
import Profile from './profile';
import { supabase } from './client';

function Root() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUp />} />

        {/* Private routes wrapped in layout */}
        <Route path="/" element={<App />}>
          <Route path="home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="create-new-post" element={user ? <CreateNewPost /> : <Navigate to="/" />} />
          <Route path="post/:postId" element={user ? <PostDetails /> : <Navigate to="/" />} />
          <Route path="edit/:postId" element={user ? <EditPost /> : <Navigate to="/" />} />
          <Route path="profile" element={user ? <Profile /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);


export default App;