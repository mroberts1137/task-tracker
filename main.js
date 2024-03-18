const startBtnEl = document.querySelector('#startBtn');
startBtnEl.addEventListener('click', () => {
  toggleClock();
  console.log(startBtnEl.className);
});

const goalListEl = document.querySelector('#goalList');
const addButtonEl = document.querySelector('#addButton');
addButtonEl.addEventListener('click', (e) => {
  e.preventDefault();
  getItem(e);
  console.log(goalList);
});

let clockRunning = false;

const goalList = [];

function getItem() {
  const goal = document.querySelector('#goal').value;
  document.querySelector('#goalsForm').reset();
  if (isValidInput(goal) && !goalList.includes(goal)) {
    goalList.push(goal);
  }
  renderList();
}

function isValidInput(input) {
  if (input != null && input !== '') {
    // basic xss test for < (U+003C) and > (U+003E)
    if (!/\u003c/.test(input) && !/\u003e/.test(input)) {
      return true;
    }
  }
  return false;
}

function removeList() {
  while (goalListEl.firstChild) goalListEl.firstChild.remove();
}

function removeItem(e) {
  const item = e.currentTarget;
  item.remove();
  const itemIdx = goalList.indexOf(item.textContent);
  if (itemIdx >= 0) {
    goalList.splice(itemIdx, 1);
    renderList();
  }
}

function renderList() {
  removeList();
  goalList.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', removeItem);
    goalListEl.appendChild(li);
  });
}

function toggleClock() {
  if (clockRunning) {
    clockRunning = false;
    startBtnEl.classList.remove('clockRunning');
  } else {
    clockRunning = true;
    startBtnEl.classList.add('clockRunning');
  }
}
