const nums = process.argv.slice(2).map((num) => Number(num));

const sum = nums.reduce((acc, curr) => {
  return acc += curr;
}, 0);

console.log(sum);
