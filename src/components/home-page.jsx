import React from 'react';
import './home-page.css';

export default function Home() {
    return (
        <div className='home-page'>
            <h1 className='title'>Welcome to inkFlow.io</h1>
            <p className='intro'>
                This is a type practice webapp inspired by{' '}
                <a className='underlined' href='https://www.typelit.io/'>
                    typelit.io.
                </a>{' '}
                I made it to practice react and I wanted to import my own books. Let me
                know if you liked this or not. Feedbacks are always welcomed :D send
                feedbacks to me on discord at @doctorthe113.
            </p>
            <p className='text'>
                <div className='centered'>
                    <hr />
                    To begin click on keyboard icon on the navbar
                    <hr />
                </div>
                <br />
                <br />
                {/* <u>Instuctions,</u> */}
                {/* <u>
                    <strong>(⚠️ and underlined words means under development)</strong>
                </u> */}
                {/* prettier-ignore */}
                <ul>
            <li>Default theme is catppuccin which can be changed in the user menu. Post theme suggestions on discord or github issues.</li>
            <li>Default typing font is 'Space Mono' from Google Fonts.</li>
            <li>To add new books, you need to give .epub file.</li>
            <li>Progress are not saved in the cloud because I am poor for cloud.</li>
        </ul>
            </p>
        </div>
    );
}
