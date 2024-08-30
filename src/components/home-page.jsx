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
                feedbacks to me on discord at @doctorthe113. This is made for big
                screens such as desktops and laptops. But mobile users can use it using
                the "desktop site" mode enabled in the browser.
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
            <li>Default typing font is 'Landex' from Google Fonts. This is done to help with dyslexia and trouble reading texts. Feedbacks are appreciated regarding this!</li>
            <li>To add new books, you need to give .epub file.</li>
            <li>Progress are not saved in the cloud because I am poor for cloud.</li>
        </ul>
            </p>
        </div>
    );
}
