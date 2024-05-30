import { useEffect, useRef, useState } from 'react';
import Epub from 'epubjs';
import './type-page.css';

const bookURLMap = {
  1: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/alices-adventures-in-wonderland-by-lewis-carroll.epub',
  2: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/don-quijote-de-la-mancha-by-miguel-de-cervantes-saavedra.epub',
  3: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/dracula-by-bram-stoker.epub',
  4: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/frankenstein-or-the-modern-prometheus-by-mary-wollstonecraft-shelley.epub',
  5: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/gullivers-travels-into-several-remote-nations-of-the-world-by-jonathan-swift.epub',
  6: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/hamlet-prince-of-denmark-by-william-shakespeare.epub',
  7: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/incidents-in-the-life-of-a-slave-girl-written-by-herself-by-harriet-a-jacobs.epub',
  8: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/metamorphosis-by-franz-kafka.epub',
  9: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/moby-dick-or-the-whale-by-herman-melville.epub',
  10: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/oliver-twist-by-charles-dickens.epub',
  11: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/pride-and-prejudice-by-jane-austen.epub',
  12: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/romeo-and-juliet-by-william-shakespeare.epub',
  13: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-adventures-of-sherlock-holmes-by-arthur-conan-doyle.epub',
  14: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-adventures-of-tom-sawyer-complete-by-mark-twain.epub',
  15: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-art-of-war-by-active-6th-century-bsunzi.epub',
  16: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-complete-works-of-william-shakespeare-by-william-shakespeare.epub',
  17: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-count-of-monte-cristo-by-alexandre-dumas-and-auguste-maquet.epub',
  18: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-great-gatsby-by-fscott-fitzgerald.epub',
  19: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-jungle-book-by-rudyard-kipling.epub',
  20: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-odyssey-by-homer.epub',
  21: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-social-cancer-a-complete-english-version-of-noli-me-tangere-by-josé-rizal.epub',
  22: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-strange-case-of-dr-jekyll-and-mr-hyde-by-robert-louis-stevenson.epub',
  23: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-thousand-and-one-nights-vol-i-by-lane-lane-poole-poole-and-harvey.epub',
  24: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/through-the-looking-glass-by-lewis-carroll.epub',
  25: 'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/winnie-the-pooh-by-a-a-milne.epub',
};

const neg_to_zero = (num) => {
  if (num < 0) {
    return 0;
  } else {
    return num;
  }
};

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
          })
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
  const [bookName, setBookName] = useState('Upload book here');
  const [book, setBook] = useState([]); //                Contains all the chapters
  const [text, setText] = useState(''); //                Contains the text inside a chapter
  const [chapterCount, setChapterCount] = useState(0); // Counts chapters
  // const [chapter, setChapter] = useState(''); //       Current chapter's content
  const [pages, setPages] = useState([]); //              Contains 200 words pages
  const [pageNum, setPageNum] = useState(0);
  const [wordCount, setWordCount] = useState(0); //       Counts words
  const [wpm, setWpm] = useState(0); //                   Counts wpm -> words / time
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(0); //               For checking if user has typed anything or not
  const [errCount, setErrCount] = useState(0);
  const [accuracy, setAccuracy] = useState('100%');
  const [isTyping, setIsTyping] = useState(false);

  const css = getComputedStyle(document.documentElement);
  const accentColor = css.getPropertyValue('--accent-color');
  const wrongColor = css.getPropertyValue('--wrong-color');
  const wrongBGColor = css.getPropertyValue('--wrong-background');

  let interval;
  let timeRef = useRef(time);
  let timerRef = useRef(timer);

  let filteredText = text.replace(/[“”]/g, '"');
  let textArr = filteredText.split('');

  const load_library_book = (e) => {
    let bookURL = bookURLMap[e.target.value];
    book_update(bookURL);
  };

  const book_update = (bookPath) => {
    // bookPath =
    //   'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/frankenstein-or-the-modern-prometheus-by-mary-wollstonecraft-shelley.epub';
    load_book(bookPath).then((book) => {
      console.log(book);
      console.log(book.bookContents);
      setBookName(book.bookName);
      setBook(book.bookContents);
      page_maker(book.bookContents[0]);
      setChapterCount(book.bookContents.length);
    });
  };

  const chapter_update = (e) => {
    setChapterCount(e.target.value);
    page_maker(book[e.target.value]);
  };

  const page_maker = (content) => {
    if (content == '') {
      content = '<Empty. Please change chapter>';
    }
    let splitString = [];
    let count = 0;
    let prevIndex = 0;
    Array.from(content).forEach((element, index) => {
      if (element == ' ' && count >= 99) {
        splitString.push(content.slice(prevIndex, index));
        count = 0;
        prevIndex = index + 1;
      } else if (content.length == index + 1) {
        splitString.push(content.slice(prevIndex, index + 1));
      } else if (element == ' ') {
        count++;
      }
    });
    setPages(splitString);
    setPageNum(0);
    setText(splitString[0]);
  };

  const page_update = (e) => {
    setPageNum(e.target.value);
    setText(pages[e.target.value]);
  };

  const type_update = (e) => {
    let inputText = e.target.value;
    let charAll = document.getElementsByClassName('letter');

    // checks if user is typing or not and reset timer
    setIsTyping(true);
    setTimer(0);

    try {
      let char = document.getElementById('char' + neg_to_zero(inputText.length - 1));
      let charNext = document.getElementById('char' + inputText.length);

      // check if typed letter is same as letter on screen
      if (inputText.slice(-1) == text[inputText.length - 1]) {
        char.style.color = accentColor;
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
      // charNext.style.animation = 'cursorFade 0.25s infinite';
    } catch (error) {}

    // counts accuracy
    setAccuracy(`${(((text.length - errCount) / text.length) * 100).toPrecision(3)}%`);

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
          : 'End of chapter reached'
      );
      setPageNum(pageNum + 1);
      e.target.value = '';
      Array.from(charAll).forEach((element) => {
        element.style.color = 'var(--font-color2)';
        element.style.backgroundColor = 'transparent';
      });
    }
  };

  useEffect(() => {
    timeRef.current = time;
    timerRef.current = timer;
  }, [time]);

  useEffect(() => {
    if (isTyping) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
        setTimer((prevTimer) => prevTimer + 10);
        if (timerRef.current >= 5000) {
          alert('>5s have passed. Timer has been paused');
          setIsTyping(false);
          setTimer(0);
        }
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className='type'>
      <div className='type-bar'>
        {/* prettier-ignore */}
        <div className='book-select'>
          <label className='book-selecter' htmlFor='book-upload'><span>{bookName}</span></label>
          <input
            id='book-upload'
            type='file'
            accept='.epub, .opf'
            onChange={(e) => book_update(e.target.files[0])}
          />
          <select className='book-selecter' onChange={(e) => load_library_book(e)}>
            <option value='' disabled selected hidden>or, choose a book from the library</option>
            <option value='1'>Alice's adventures in wonderland</option>
            <option value='2'>Don quijote</option>
            <option value='3'>Dracula</option>
            <option value='4'>Frankenstein; or, the Modern Prometheus</option>
            <option value='5'>Gulliver's travel into the several remote nations of the world</option>
            <option value="6">Hamlet prince</option>
            <option value="7">Incidents in the life of a slave girl</option>
            <option value="8">Metamorphosis</option>
            <option value="9">Moby Dick</option>
            <option value="10">Oliver Twist</option>
            <option value="11">Pride and prejudice</option>
            <option value="12">Romeo and Juliet</option>
            <option value="13">The adventures of Sherlock Holmes</option>
            <option value="14">The adventures of Tom Sawyer</option>
            <option value="15">The art of war</option>
            <option value="16">The complete works of William Shakespeare</option>
            <option value="17">The count of Monte Cristo</option>
            <option value="18">The great Gatsby</option>
            <option value="19">The jungle book</option>
            <option value="20">The odyssey</option>
            <option value="21">The social cancer \(English version\)</option>
            <option value="22">The strange case of Dr, Jekyll and Mr, Hyde</option>
            <option value="23">The thousand and one nights</option>
            <option value="24">Through the looking glass</option>
            <option value="25">Winnie the pooh</option>
          </select>
          <div className='chapter-page-selecter'>
            Chapter:
            <select className='chapter-page-select' onChange={(e) => chapter_update(e)}>
              <option value='' disabled selected hidden>0</option>
              {book.map((chapter, index) => {
                return <option value={index}>{index + 1}</option>;
              })}
            </select>
            Page:
            <select className='chapter-page-select' onChange={(e) => page_update(e)}>
              <option value='' disabled selected hidden>0</option>
              {pages.map((page, index) => {
                return <option value={index}>{index + 1}</option>;
              })}
            </select>
          </div>
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
        <textarea className='typebox' spellCheck='false' onChange={type_update} />
      </div>
      <div className='page-num-show'>
        <hr />
        <span> {parseInt(pageNum) + 1} </span>
        <hr />
      </div>
    </div>
  );
}
