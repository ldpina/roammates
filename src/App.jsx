import './App.css';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react'; 
import homeIcon from './icons/homeICON2.png';


function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="topNav">
        <h1>RoamMates</h1>
        <input type="text" placeholder="Search by title..." value={searchQuery}  onChange={handleSearchChange} className="searchInput"
        />
        <div className="buttonImageContainer">
          <Link to="/">
            <img src={homeIcon} alt="Home Icon" />
          </Link>
          <Link className='createButton' to="/create-new-post">
            Create Post
          </Link>
        </div>
      </div>
      
      <div className="pageContent">
        <Outlet context={{ searchQuery }} /> 
      </div>
    </>
  );
}

export default App;
