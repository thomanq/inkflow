import { useEffect, useState } from 'react';
import inkflow from './assets/inkflow.webp';
import HomePage from './components/home-page';
import TypePage from './components/type-page';
import UserPage from './components/user-page';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth < 800 || windowHeight < 550) {
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
            {/* <button onClick={() => refresh()}><img src={refreshIcon} /></button>
            <button onClick={() => setPage('home')}><img src={homeIcon} /></button>
            <button onClick={() => setPage('type')}><img src={typeIcon} /></button>
            <button onClick={() => setPage('user')}><img src={userIcon} /></button> */}
            <button onClick={() => setPage('home')}><i class="material-symbols-outlined">home</i></button>
            <button onClick={() => refresh()}><i class="material-symbols-outlined">refresh</i></button>
            <button onClick={() => setPage('type')}><i class="material-symbols-outlined">keyboard</i></button>
            <button onClick={() => setPage('user')}><i class="material-symbols-outlined">person</i></button>
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
