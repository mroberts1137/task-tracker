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

const totalGoalValueEl = document.querySelector('#totalGoalValue');

let clockRunning = false;

const goalList = [];
let totalGoalValue = 0;

function getItem() {
  const goalDescription = document.querySelector('#goal').value;
  const value = document.querySelector('#value').value;
  document.querySelector('#goalsForm').reset();
  if (isValidInput(goalDescription)) {
    const goal = {
      description: goalDescription,
      value: value
    };
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
  goalList.forEach((goal) => {
    const tr = document.createElement('tr');
    const goalTd = document.createElement('td');
    const valueTd = document.createElement('td');
    goalTd.textContent = goal.description;
    goalTd.addEventListener('click', removeItem);
    valueTd.textContent = `\$${goal.value}`;

    tr.appendChild(goalTd);
    tr.appendChild(valueTd);
    goalListEl.appendChild(tr);

    totalGoalValue = goalList
      .map((goal) => goal.value)
      .reduce((acc, val) => parseInt(acc) + parseInt(val), 0);
    totalGoalValueEl.innerText = `\$${parseInt(totalGoalValue)}`;
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
