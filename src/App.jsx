import { useEffect, useState } from 'react';
import inkflow from './assets/inkflow.webp';
import refreshIcon from './assets/refresh.svg';
import homeIcon from './assets/home.svg';
import typeIcon from './assets/type.svg';
import userIcon from './assets/user.svg';
import HomePage from './components/home-page';
import TypePage from './components/type-page';
import UserPage from './components/user-page';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const refresh = () => {
    let prevPage = page;
    setPage('none');
    setTimeout(() => {
      setPage(prevPage);
    }, 100);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth < 800) {
    alert('Window is too small. Please use a larger screen.');
    return null;
  }

  return (
    <>
      <div className='app'>
        <div className='navbar'>
          {/* prettier-ignore */}
          <a href='/'><img src={inkflow} /></a>
          {/* prettier-ignore */}
          <div className='nav-buttons'>
            <button onClick={() => refresh()}><img src={refreshIcon} /></button>
            <button onClick={() => setPage('home')}><img src={homeIcon} /></button>
            <button onClick={() => setPage('type')}><img src={typeIcon} /></button>
            <button onClick={() => setPage('user')}><img src={userIcon} /></button>
          </div>
        </div>
        <hr />
        <div className='pages'>
          {page == 'home' ? <HomePage /> : null}
          {page == 'type' ? <TypePage /> : null}
          {page == 'user' ? <UserPage /> : null}
        </div>
      </div>
    </>
  );
}

const lock = document.createElement('meta');
lock.name = 'darkreader-lock';
document.head.appendChild(lock);
export default App;
