import './App.css';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react'; 
import homeIcon from './icons/homeICON2.png';
import { supabase } from './client';


function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="topNav">
        <Link to = "/" className = "logoRoammates">RoamMates</Link>
        <input type="text" placeholder="Search by title..." value={searchQuery}  onChange={handleSearchChange} className="searchInput"
        />
        <div className="buttonImageContainer">
          <Link to="/">
            <img src={homeIcon} alt="Home Icon" />
          </Link>
          <Link className='createButton' to="/create-new-post">
            Create Post
          </Link>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_circle" />
          <Link to="/profile">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
          <button onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/'; // Redirect after sign out
          }}>Force Sign Out</button>
        </div>
      </div>
      
      <div className="pageContent">
        <Outlet context={{ searchQuery }} /> 
      </div>
    </>
  );
}

export default App;
