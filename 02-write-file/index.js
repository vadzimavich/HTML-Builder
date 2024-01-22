const fs = require('fs');
const path = require('path');
const readline = require('readline');

const textPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(textPath, 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput() {
  rl.question('> ', (inputText) => {
    if (inputText.toLowerCase() === 'exit') {
      rl.close();
      writeStream.close();
      process.exit();
    } else {
      writeStream.write(inputText + '\n');
      getInput();
    }
  });
}

process.on('SIGINT', () => {
  writeStream.end();
  rl.close();
  process.exit();
});

process.on('exit', () => {
  console.log('The file "text.txt" has been saved, bye!');
});

console.log('Please, input the text. Press Ctrl+C or type "exit" to quit');

getInput();
