const compareStrings = (str1, str2) => {
  if (str1 < str2) {
    return -1;
  }
  if (str1 > str2) {
    return 1;
  }
  return 0;
};

const sortByTitle = (arr) => arr.sort((a, b) => compareStrings(a.title, b.title));

const sortByDate = (arr) => arr.sort((a, b) => {
  const result = a.date - b.date;
  if (result === 0) {
    return compareStrings(a.time, b.time);
  }
  return result;
});

const sortByPriority = (arr) => arr.sort((a, b) => b.priority - a.priority);

module.exports = {
  sortByTitle,
  sortByDate,
  sortByPriority,
};
