const startBtnEl = document.querySelector('#startBtn');
startBtnEl.addEventListener('click', () => {
  toggleClock();
  console.log(startBtnEl.className);
});
const restartBtn = document.querySelector('#resetBtn');
restartBtn.addEventListener('click', reset);

const goalListEl = document.querySelector('#goalList');
const addButtonEl = document.querySelector('#addButton');
addButtonEl.addEventListener('click', (e) => {
  e.preventDefault();
  getItem(e);
  console.log(goalList);
});

const trackListEl = document.querySelector('#trackList');
const totalEarningsEl = document.querySelector('#totalEarnings');

const totalGoalValueEl = document.querySelector('#totalGoalValue');
const startTimeEl = document.querySelector('#startTime');
const endTimeEl = document.querySelector('#endTime');
const elapsedTimeEl = document.querySelector('#elapsedTime');
const earningsEl = document.querySelector('#earnings');

const rateEl = document.querySelector('#rate');
rateEl.addEventListener('change', (e) => (rate = e.target.value));

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let clockRunning = false;

const goalList = [];
const trackList = [];
let totalGoalValue = 0;
let totalEarnings = 0;
let startTime = null;
let endTime = null;
let elapsedTime = null;
let earnings = 0;
let rate = 40;
let goalProgress = 0;

let updateEarningsInterval = null;

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

function removeList(listEl) {
  while (listEl.firstChild) listEl.firstChild.remove();
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
  removeList(goalListEl);
  goalList.forEach((goal) => {
    const tr = document.createElement('tr');
    const goalTd = document.createElement('td');
    const valueTd = document.createElement('td');
    goalTd.textContent = goal.description;
    valueTd.textContent = `\$${goal.value}`;
    tr.addEventListener('click', removeItem);

    tr.appendChild(goalTd);
    tr.appendChild(valueTd);
    goalListEl.appendChild(tr);
  });

  totalGoalValue = goalList
    .map((goal) => goal.value)
    .reduce((acc, val) => parseFloat(acc) + parseFloat(val), 0);
  totalGoalValueEl.innerText = `\$${totalGoalValue}`;
}

function renderTrackList() {
  removeList(trackListEl);
  trackListEl.innerHTML = `<tr>
      <th>Start Time</th>
      <th>End Time</th>
      <th>Elapsed Time (hrs)</th>
      <th>Earnings</th>
    </tr>`;
  trackList.forEach((item) => {
    const tr = document.createElement('tr');
    const startTimeTd = document.createElement('td');
    const endTimeTd = document.createElement('td');
    const elapsedTimeTd = document.createElement('td');
    const earningsTd = document.createElement('td');
    startTimeTd.textContent = `${item.startTime.getHours()}:${item.startTime.getMinutes()}`;
    endTimeTd.textContent = `${item.endTime.getHours()}:${item.endTime.getMinutes()}`;
    elapsedTimeTd.textContent = item.elapsedTime;
    earningsTd.textContent = `\$${item.earnings}`;

    tr.appendChild(startTimeTd);
    tr.appendChild(endTimeTd);
    tr.appendChild(elapsedTimeTd);
    tr.appendChild(earningsTd);
    trackListEl.appendChild(tr);
  });

  totalEarnings = trackList
    .map((item) => item.earnings)
    .reduce((acc, val) => parseFloat(acc) + parseFloat(val), 0);
  totalEarningsEl.innerText = totalEarnings;
  console.log(totalEarnings);
}

function toggleClock() {
  updateProgress();
  if (clockRunning) {
    clockRunning = false;
    startBtnEl.classList.remove('clockRunning');
    startBtnEl.innerText = 'Start';

    clearInterval(updateEarningsInterval);

    endTime = new Date();
    elapsedTime =
      Math.floor(((endTime - startTime) / (10 * 60 * 60)) * 100) / 100;
    earnings = Math.floor(elapsedTime * rate * 100) / 100;
    endTimeEl.innerText = `${endTime.getHours()}:${endTime.getMinutes()}`;
    elapsedTimeEl.innerText = elapsedTime;
    earningsEl.innerText = earnings;

    trackList.push({
      startTime,
      endTime,
      elapsedTime,
      earnings
    });
    renderTrackList();
    reset();
  } else {
    clockRunning = true;
    startBtnEl.classList.add('clockRunning');
    startBtnEl.innerText = 'Stop';

    updateEarningsInterval = setInterval(updateElapsedTime, 1000);

    startTime = new Date();
    startTimeEl.innerText = `${startTime.getHours()}:${startTime.getMinutes()}`;
  }
}

function updateElapsedTime() {
  let currentTime = new Date();
  elapsedTime =
    Math.floor(((currentTime - startTime) / (10 * 60 * 60)) * 100) / 100;
  earnings = Math.floor(elapsedTime * rate * 100) / 100;

  elapsedTimeEl.innerText = elapsedTime;
  earningsEl.innerText = earnings;
  updateProgress();
}

function reset() {
  clockRunning = false;
  startBtnEl.classList.remove('clockRunning');
  clearInterval(updateEarningsInterval);
  startTime = null;
  endTime = null;
  elapsedTime = 0;
  earnings = 0;
  startTimeEl.innerText = '-';
  endTimeEl.innerText = '-';
  elapsedTimeEl.innerText = '0';
  earningsEl.innerText = '0';
}

function updateProgress() {
  goalProgress = (totalEarnings + earnings) / totalGoalValue;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, parseInt(canvas.width * goalProgress), canvas.height);
  ctx.font = '25px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(
    `\%${Math.floor(goalProgress * 1000) / 10}`,
    canvas.width * 0.5,
    canvas.height * 0.5
  );
}
