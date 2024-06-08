let bookURLMap = {
  "Alice's adventures in wonderland":
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/alices-adventures-in-wonderland-by-lewis-carroll.epub',
  'Don quijote':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/don-quijote-by-miguel-de-cervantes-saavedra.epub',
  Dracula:
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/dracula-by-bram-stoker.epub',
  'Frankenstein; or, the Modern Prometheus':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/frankenstein-or-the-modern-prometheus-by-mary-wollstonecraft-shelley.epub',
  "Gulliver's travel into the several remote nations of the world":
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/gullivers-travels-into-several-remote-nations-of-the-world-by-jonathan-swift.epub',
  'Hamlet prince':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/hamlet-prince-of-denmark-by-william-shakespeare.epub',
  'Incidents in the life of a slave girl':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/incidents-in-the-life-of-a-slave-girl-written-by-herself-by-harriet-a-jacobs.epub',
  Metamorphosis:
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/metamorphosis-by-franz-kafka.epub',
  'Moby dick':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/moby-dick-or-the-whale-by-herman-melville.epub',
  'Oliver Twist':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/oliver-twist-by-charles-dickens.epub',
  'Pride and prejudice':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/pride-and-prejudice-by-jane-austen.epub',
  'Romeo and juliet':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/romeo-and-juliet-by-william-shakespeare.epub',
  'The adventures of sherlock holmes':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-adventures-of-sherlock-holmes-by-arthur-conan-doyle.epub',
  'The adventures of Tom Sawyer':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-adventures-of-tom-sawyer-complete-by-mark-twain.epub',
  'The art of war':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-art-of-war-by-active-6th-century-bsunzi.epub',
  'The complete works of william shakespeare':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-complete-works-of-william-shakespeare-by-william-shakespeare.epub',
  'The count of Monte Cristo':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-count-of-monte-cristo-by-alexandre-dumas-and-auguste-maquet.epub',
  'The great gatsby':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-great-gatsby-by-fscott-fitzgerald.epub',
  'The jungle book':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-jungle-book-by-rudyard-kipling.epub',
  'The odyssey':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-odyssey-by-homer.epub',
  'The social cancer':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-social-cancer-a-complete-english-version-of-noli-me-tangere-by-josé-rizal.epub',
  'The strange case of Dr Jekyll and Mr Hyde':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-strange-case-of-dr-jekyll-and-mr-hyde-by-robert-louis-stevenson.epub',
  'The thousand and one nights':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/the-thousand-and-one-nights-vol-i-by-lane-lane-poole-poole-and-harvey.epub',
  'Through the looking glass':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/through-the-looking-glass-by-lewis-carroll.epub',
  'Winnie the pooh':
    'https://cdn.jsdelivr.net/gh/doctorthe113/inkflow/sample-books/winnie-the-pooh-by-a-a-milne.epub',
};

let arr = [];

for (let x in bookURLMap) {
  arr.push(x);
}
console.log(arr);
