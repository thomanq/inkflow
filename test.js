const string =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi nemo consequatur ut itaque. Nesciunt harum tenetur, vitae aspernatur esse voluptatem in sint eos exercitationem obcaecati illo consectetur architecto doloremque aut hello';

let splitString = [];
let count = 0;
let prevIndex = 0;
Array.from(string).forEach((element, index) => {
  if (element == ' ' && count >= 9) {
    splitString.push(tempString.slice(prevIndex, index));
    count = 0;
    prevIndex = index + 1;
  } else if (string.length == index + 1) {
    splitString.push(tempString.slice(prevIndex, index + 1));
  } else if (element == ' ') {
    count++;
  }
});

console.log(splitString);
