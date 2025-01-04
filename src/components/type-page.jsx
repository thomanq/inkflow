import { useEffect, useRef, useState } from 'react';
import Epub from 'epubjs';
import './type-page.css';
import '../assets/themes.css';

const sampleBooksRoot = 'http://localhost:3000/sample-books';

const libraryMap = {
    "Alice's adventures in wonderland": `${sampleBooksRoot}/alices-adventures-in-wonderland-by-lewis-carroll.epub`,
    'Don quijote': `${sampleBooksRoot}/don-quijote-by-miguel-de-cervantes-saavedra.epub`,
    Dracula: `${sampleBooksRoot}/dracula-by-bram-stoker.epub`,
    'Frankenstein; or, the Modern Prometheus': `${sampleBooksRoot}/frankenstein-or-the-modern-prometheus-by-mary-wollstonecraft-shelley.epub`,
    "Gulliver's travel into the several remote nations of the world": `${sampleBooksRoot}/gullivers-travels-into-several-remote-nations-of-the-world-by-jonathan-swift.epub`,
    'Hamlet prince': `${sampleBooksRoot}/hamlet-prince-of-denmark-by-william-shakespeare.epub`,
    'Incidents in the life of a slave girl': `${sampleBooksRoot}/incidents-in-the-life-of-a-slave-girl-written-by-herself-by-harriet-a-jacobs.epub`,
    Metamorphosis: `${sampleBooksRoot}/metamorphosis-by-franz-kafka.epub`,
    'Moby dick': `${sampleBooksRoot}/moby-dick-or-the-whale-by-herman-melville.epub`,
    'Oliver Twist': `${sampleBooksRoot}/oliver-twist-by-charles-dickens.epub`,
    'Pride and prejudice': `${sampleBooksRoot}/pride-and-prejudice-by-jane-austen.epub`,
    'Romeo and juliet': `${sampleBooksRoot}/romeo-and-juliet-by-william-shakespeare.epub`,
    'The adventures of sherlock holmes': `${sampleBooksRoot}/the-adventures-of-sherlock-holmes-by-arthur-conan-doyle.epub`,
    'The adventures of Tom Sawyer': `${sampleBooksRoot}/the-adventures-of-tom-sawyer-complete-by-mark-twain.epub`,
    'The art of war': `${sampleBooksRoot}/the-art-of-war-by-active-6th-century-bsunzi.epub`,
    'The complete works of william shakespeare': `${sampleBooksRoot}/the-complete-works-of-william-shakespeare-by-william-shakespeare.epub`,
    'The count of Monte Cristo': `${sampleBooksRoot}/the-count-of-monte-cristo-by-alexandre-dumas-and-auguste-maquet.epub`,
    'The great gatsby': `${sampleBooksRoot}/the-great-gatsby-by-fscott-fitzgerald.epub`,
    'The jungle book': `${sampleBooksRoot}/the-jungle-book-by-rudyard-kipling.epub`,
    'The odyssey': `${sampleBooksRoot}/the-odyssey-by-homer.epub`,
    'The social cancer': `${sampleBooksRoot}/the-social-cancer-a-complete-english-version-of-noli-me-tangere-by-josé-rizal.epub`,
    'The strange case of Dr Jekyll and Mr Hyde': `${sampleBooksRoot}/the-strange-case-of-dr-jekyll-and-mr-hyde-by-robert-louis-stevenson.epub`,
    'The thousand and one nights': `${sampleBooksRoot}/the-thousand-and-one-nights-vol-i-by-lane-lane-poole-poole-and-harvey.epub`,
    'Through the looking glass': `${sampleBooksRoot}/through-the-looking-glass-by-lewis-carroll.epub`,
    'Winnie the pooh': `${sampleBooksRoot}/winnie-the-pooh-by-a-a-milne.epub`,
};

const neg_to_zero = (num) => {
    if (num < 0) {
        return 0;
    } else {
        return num;
    }
};

// loading the book using epubjs. It's here outside to reduce reloading the func every time
const load_book = (bookPath) => {
    return new Promise((resolve, reject) => {
        const book = new Epub(bookPath);
        let bookTitle = '';
        const bookContent = [];
        const promises = [];

        book.loaded.metadata.then(function (metadata) {
            bookTitle = metadata.title;
        });

        book.loaded.spine.then(function (spine) {
            spine.each(function (section) {
                // Load the section content
                promises.push(
                    section.load(book.load.bind(book)).then(function (contents) {
                        // console.log(contents);
                        let pTags = contents.querySelectorAll('p');
                        let allText = Array.from(pTags)
                            .map(function (p) {
                                return p.textContent;
                            })
                            .join('\n');
                        bookContent.push(allText);
                    }),
                );
            });
            Promise.all(promises)
                .then(function () {
                    resolve({ bookName: bookTitle, bookContents: bookContent });
                })
                .catch(reject);
        });
    });
};

export default function Type() {
    let configs = JSON.parse(localStorage.getItem('config'));
    const [punctuation, setPunctuation] = useState(configs.punctuation);
    const [caseCheck, setCaseCheck] = useState(configs.caseCheck);
    const [theme, setTheme] = useState(configs.theme);
    const [bookName, setBookName] = useState('Upload book here or select from here =>');
    const [book, setBook] = useState([]); //                Contains all the chapters
    const [text, setText] = useState(''); //                Contains the text inside a chapter
    const [pages, setPages] = useState([]); //              Contains 200 words pages
    const [pageNum, setPageNum] = useState(0);
    const [wordCount, setWordCount] = useState(0); //       Counts words
    const [wpm, setWpm] = useState(0); //                   Counts wpm -> words / time
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(0); //               For checking if user has typed anything or not
    const [errCount, setErrCount] = useState(0);
    const [accuracy, setAccuracy] = useState('100%');
    const [isTyping, setIsTyping] = useState(false);

    const css = getComputedStyle(document.body);
    const typeColor = css.getPropertyValue('--type-color');
    const wrongColor = css.getPropertyValue('--wrong-color');
    const wrongBGColor = css.getPropertyValue('--wrong-highlight');

    let interval;
    let timeRef = useRef(time);
    let timerRef = useRef(timer);

    // filteres the text more makes an array of characters
    let filteredText = text.replace(/[“”]/g, '"');
    let textArr = filteredText.split('');

    // loads the library book
    const load_library_book = (e) => {
        let bookURL = libraryMap[e.target.value];
        book_update(bookURL);
    };

    // loads the uploaded book
    const book_update = (bookPath) => {
        load_book(bookPath).then((book) => {
            setBookName(book.bookName);
            setBook(book.bookContents);
            page_maker(book.bookContents[0]);
        });
    };

    // loads the selected chapter
    const chapter_update = (e) => {
        page_maker(book[e.target.value]);
    };

    // loads the selected page
    const page_maker = (content) => {
        clearpageState();
        if (content == '') {
            content = '<Empty. Please change chapter>';
        }
        let pages = [];
        let count = 0;
        let prevIndex = 0;
        Array.from(content).forEach((element, index) => {
            if (element == ' ' && count >= 99) {
                pages.push(content.slice(prevIndex, index).trim());
                count = 0;
                prevIndex = index + 1;
            } else if (content.length == index + 1) {
                pages.push(content.slice(prevIndex, index + 1).trim());
            } else if (element == ' ') {
                count++;
            }
        });
        setPages(pages);
        setPageNum(0);
        // filters the text according to configs
        let tempText = pages[0];
        if (!caseCheck) {
            tempText = tempText.toLowerCase();
        }
        if (!punctuation) {
            tempText = tempText.replace(/[.,\/#!?$%\^&\*;:{}—=\-_`'"~()]/g, '');
        }
        setText(tempText);
    };

    const simplify = (char) => {
        return (
            {
                '’': "'",
                '“': '"',
                '”': '"',
                '—': '-',
            }[char] || char
        );
    };

    const clearpageState = () => {
        let charAll = document.getElementsByClassName('letter');
        Array.from(charAll).forEach((element) => {
            element.removeAttribute('style');
        });
        let typebox = document.getElementById('typebox');
        typebox.value = '';
    };

    // loads the selected page and filters the text according to configs
    const page_update = (e) => {
        clearpageState();
        setPageNum(parseInt(e.target.value, 10));
        let tempText = pages[e.target.value];

        if (!caseCheck) {
            tempText = tempText.toLowerCase();
        }
        if (!punctuation) {
            tempText = tempText.replace(/[.,\/#!?$%\^&\*;:{}—=\-_`'"~()]/g, '');
        }
        setText(tempText);
    };

    // type update
    const type_update = (e) => {
        let inputText = e.target.value;
        let charAll = document.getElementsByClassName('letter');

        // checks if user is typing or not and reset timer
        setIsTyping(true);
        setTimer(0);

        try {
            let char = document.getElementById(
                'char' + neg_to_zero(inputText.length - 1),
            );
            let charNext = document.getElementById('char' + inputText.length);

            // check if typed letter is same as letter on screen
            if (inputText.slice(-1) == simplify(text[inputText.length - 1])) {
                char.style.color = typeColor;
                char.style.backgroundColor = '';
            } else {
                char.style.color = wrongColor;
                char.style.backgroundColor = wrongBGColor;
                setErrCount(errCount + 1);
            }

            // adds block cursor
            Array.from(charAll).forEach((element) => {
                element.style.border = '1px solid transparent';
            });
            charNext.style.border = '1px solid var(--accent-color)';
        } catch (error) {}

        // counts accuracy
        setAccuracy(
            `${(((text.length - errCount) / text.length) * 100).toPrecision(3)}%`,
        );

        // word and wpm counter
        if (inputText.slice(-1) == ' ') {
            setWordCount(wordCount + 1);
            setWpm(Math.round((wordCount * 1000 * 60) / time));
        }

        // updates the page
        if (inputText.length == text.length) {
            setText(
                typeof pages[pageNum + 1] == 'string'
                    ? pages[pageNum + 1]
                    : 'End of chapter reached',
            );
            setPageNum(pageNum + 1);
            e.target.value = '';
            clearpageState();
        }
    };

    useEffect(() => {
        timeRef.current = time;
        timerRef.current = timer;
    }, [time]);

    useEffect(() => {
        if (isTyping) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 100);
                setTimer((prevTimer) => prevTimer + 100);
                if (timerRef.current >= 5000) {
                    alert('>5s have passed. Timer has been paused');
                    setIsTyping(false);
                    setTimer(0);
                }
            }, 100);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isTyping]);

    return (
        <div className='type-page'>
            <div className='type-bar'>
                {/* prettier-ignore */}
                <div className='select'>
          <label className='book-selecter' htmlFor='book-upload'><span>{bookName}</span></label>
          <input
            id='book-upload'
            type='file'
            accept='.epub, .opf'
            onChange={(e) => book_update(e.target.files[0])}
          />
          <div className='book-selecter' id='lib-select-container'>
            <i className='material-symbols-outlined' id='lib-select-bg'>book_2</i>
            <select id="lib-selecter" onChange={(e) => load_library_book(e)}>
              <option value='' disabled selected hidden>or, choose a book from the library</option>
              {Object.keys(libraryMap).map((key) => {
                return <option value={key}>{key}</option>;
              })}
            </select>
          </div>
            <span>Chapter:</span>
            <select className='chapter-page-selecter' onChange={(e) => chapter_update(e)}>
              <option value='' disabled selected hidden>0</option>
              {book.map((chapter, index) => {
                return <option value={index}>{index + 1}</option>;
              })}
            </select>
            <span>Page:</span>
            <select className='chapter-page-selecter' onChange={(e) => page_update(e)}>
              <option value='' disabled selected hidden>0</option>
              {pages.map((page, index) => {
                return <option value={index}>{index + 1}</option>;
              })}
            </select>
        </div>
                <hr />
                <div className='stats'>
                    <span className='stats-span'>Errors: {errCount}</span>
                    <span className='stats-span'>Accuracy: {accuracy}</span>
                    <span className='stats-span'>WPM: {wpm}</span>
                    <span className='stats-span'>Time: {time / 1000}s</span>
                </div>
            </div>
            <div className='type-area'>
                {/* prettier-ignore */}
                <div className='letters'>
          {textArr.map((letter, index) => {
            if (letter == '\n') {
              return <span className='letter' id={'char' + index}><br /></span>;
            } else {
              return <span className='letter' id={'char' + index}>{letter}</span>;
            }
          })}
        </div>
                <textarea
                    id='typebox'
                    className='typebox'
                    spellCheck='false'
                    onChange={type_update}
                />
            </div>
            <div className='page-num-show'>
                <hr />
                <span> {parseInt(pageNum) + 1} </span>
                <hr />
            </div>
        </div>
    );
}
