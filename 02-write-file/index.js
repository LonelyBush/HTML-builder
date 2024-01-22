const fs = require('fs');
const path = require('node:path');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const writeText = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({ input, output });
output.write('Введите данные, пожалуйста !');
rl.on('error', (error) => console.log('Error', error.message));
rl.on('line', (data) => {
  if (data === 'exit') {
    rl.pause(console.log('Пока-пока !'));
  } else {
    output.write('Продолжите ввод:');
    writeText.write(data);
  }
});

rl.on('SIGINT', () => {
  rl.pause(console.log('Пока-пока !'));
});
