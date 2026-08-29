let schedules = JSON.parse(
    localStorage.getItem("courtplanSchedules")
) || [];


// ========================
// SAVE DATA
// ========================

function saveData() {
    localStorage.setItem(
        "courtplanSchedules",
        JSON.stringify(schedules)
    );
}


// ========================
// SCROLL TO FORM
// ========================

function scrollToSchedule() {

    const section =
        document.getElementById("scheduleSection");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ========================
// ADD SCHEDULE
// ========================

function addSchedule() {

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value;

    const type =
        document.getElementById("type").value;

    const note =
        document.getElementById("note").value;


    if (!date || !time) {

        alert("กรุณาเลือกวันที่และเวลา");

        return;
    }


    const newSchedule = {

        id: Date.now(),

        date: date,

        time: time,

        type: type,

        note: note,

        completed: false

    };


    schedules.push(newSchedule);


    saveData();

    displaySchedules();


    // เคลียร์ช่องกรอก

    document.getElementById("date").value = "";

    document.getElementById("time").value = "";

    document.getElementById("note").value = "";
}


// ========================
// DISPLAY SCHEDULES
// ========================

function displaySchedules() {

    const list =
        document.getElementById("scheduleList");


    if (!list) return;


    list.innerHTML = "";


    if (schedules.length === 0) {

        list.innerHTML = `
            <div class="empty">
                🏀 ยังไม่มีตารางซ้อม
            </div>
        `;

        updateStats();

        return;
    }


    schedules
        .sort((a, b) => {

            return (
                new Date(a.date + "T" + a.time) -
                new Date(b.date + "T" + b.time)
            );

        })
        .forEach(schedule => {


            const card =
                document.createElement("div");


            card.className =
                "schedule-card";


            card.innerHTML = `

                <div class="schedule-info">

                    <div class="schedule-type">
                        ${schedule.type}
                    </div>

                    <h3>
                        ${schedule.date}
                        •
                        ${schedule.time}
                    </h3>

                    <p>
                        ${schedule.note || "ไม่มีรายละเอียด"}
                    </p>

                </div>


                <div class="schedule-actions">

                    <button
                        onclick="toggleComplete(${schedule.id})">

                        ${
                            schedule.completed
                            ? "✅ เสร็จแล้ว"
                            : "☐ ยังไม่ซ้อม"
                        }

                    </button>


                    <button
                        onclick="deleteSchedule(${schedule.id})">

                        🗑️ ลบ

                    </button>

                </div>

            `;


            list.appendChild(card);

        });


    updateStats();
}


// ========================
// COMPLETE
// ========================

function toggleComplete(id) {

    schedules =
        schedules.map(schedule => {

            if (schedule.id === id) {

                schedule.completed =
                    !schedule.completed;

            }

            return schedule;

        });


    saveData();

    displaySchedules();
}


// ========================
// DELETE
// ========================

function deleteSchedule(id) {

    schedules =
        schedules.filter(
            schedule => schedule.id !== id
        );


    saveData();

    displaySchedules();
}


// ========================
// STATISTICS
// ========================

function updateStats() {

    const total =
        schedules.length;


    const completed =
        schedules.filter(
            schedule => schedule.completed
        ).length;


    const remaining =
        total - completed;


    const totalElement =
        document.getElementById("total");


    const completedElement =
        document.getElementById("completed");


    const remainingElement =
        document.getElementById("remaining");


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }
}


// ========================
// START
// ========================

displaySchedules();

updateStats();
// ========================
// V4 WEEKLY DASHBOARD
// ========================

const WEEKLY_GOAL = 5;


function getStartOfWeek() {

    const today = new Date();

    const day = today.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);

    monday.setDate(today.getDate() + diff);

    monday.setHours(0, 0, 0, 0);

    return monday;
}


function updateWeeklyDashboard() {

    const start = getStartOfWeek();

    const end = new Date(start);

    end.setDate(start.getDate() + 7);


    const weeklySchedules =
        schedules.filter(schedule => {

            const scheduleDate =
                new Date(schedule.date + "T00:00:00");

            return (
                schedule.completed &&
                scheduleDate >= start &&
                scheduleDate < end
            );

        });


    const completed =
        weeklySchedules.length;


    const percent =
        Math.min(
            Math.round(
                (completed / WEEKLY_GOAL) * 100
            ),
            100
        );


    const completedElement =
        document.getElementById("weeklyCompleted");

    const goalElement =
        document.getElementById("weeklyGoal");

    const percentElement =
        document.getElementById("weeklyPercent");

    const bar =
        document.getElementById("progressBar");

    const message =
        document.getElementById("goalMessage");


    if (completedElement)
        completedElement.textContent = completed;

    if (goalElement)
        goalElement.textContent = WEEKLY_GOAL;

    if (percentElement)
        percentElement.textContent = percent + "%";

    if (bar)
        bar.style.width = percent + "%";


    if (message) {

        if (percent >= 100) {

            message.textContent =
                "🏆 เป้าหมายสัปดาห์นี้สำเร็จแล้ว!";

        } else {

            message.textContent =
                `อีก ${WEEKLY_GOAL - completed} ครั้ง
                เพื่อไปถึงเป้าหมาย 💪`;

        }

    }


    updateAchievements(completed);
}


function updateAchievements(weeklyCompleted) {

    const first =
        document.getElementById("achievement1");

    const five =
        document.getElementById("achievement2");

    const champion =
        document.getElementById("achievement3");


    if (schedules.some(
        schedule => schedule.completed
    )) {

        first?.classList.add("unlocked");

    }


    if (schedules.filter(
        schedule => schedule.completed
    ).length >= 5) {

        five?.classList.add("unlocked");

    }


    if (weeklyCompleted >= WEEKLY_GOAL) {

        champion?.classList.add("unlocked");

    }

}


// อัปเดต Dashboard

updateWeeklyDashboard();
// ========================
// V5 CALENDAR
// ========================

let weekOffset = 0;

let selectedDate = null;


function getMonday(date) {

    const d = new Date(date);

    const day = d.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    d.setHours(0, 0, 0, 0);

    return d;
}


function formatDate(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function changeWeek(direction) {

    weekOffset += direction;

    renderCalendar();

}


function renderCalendar() {

    const calendar =
        document.getElementById("calendar");

    const title =
        document.getElementById("weekTitle");

    if (!calendar) return;


    const today = new Date();

    const monday =
        getMonday(today);

    monday.setDate(
        monday.getDate() + weekOffset * 7
    );


    const sunday =
        new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );


    title.textContent =
        `${monday.getDate()} ${monday.toLocaleString("th-TH", {
            month: "short"
        })} - ${sunday.getDate()} ${sunday.toLocaleString("th-TH", {
            month: "short"
        })}`;


    calendar.innerHTML = "";


    const days = [
        "จ.",
        "อ.",
        "พ.",
        "พฤ.",
        "ศ.",
        "ส.",
        "อา."
    ];


    for (let i = 0; i < 7; i++) {

        const date =
            new Date(monday);

        date.setDate(
            monday.getDate() + i
        );


        const dateString =
            formatDate(date);


        const daySchedules =
            schedules.filter(
                schedule =>
                    schedule.date === dateString
            );


        const div =
            document.createElement("div");


        div.className = "calendar-day";


        if (
            dateString ===
            formatDate(new Date())
        ) {

            div.classList.add("today");

        }


        if (
            dateString === selectedDate
        ) {

            div.classList.add("selected");

        }


        div.innerHTML = `

            <div class="day-name">
                ${days[i]}
            </div>

            <div class="day-number">
                ${date.getDate()}
            </div>

            <div class="day-dot">
                ${
                    daySchedules.length
                    ? "🏀 " + daySchedules.length
                    : ""
                }
            </div>

        `;


        div.onclick = () => {

            selectedDate =
                dateString;

            renderCalendar();

            showSelectedDay(dateString);

        };


        calendar.appendChild(div);

    }

}


function showSelectedDay(date) {

    const list =
        document.getElementById("scheduleList");

    if (!list) return;


    const filtered =
        schedules.filter(
            schedule =>
                schedule.date === date
        );


    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="empty">
                🏀 วันนี้ยังไม่มีตารางซ้อม
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    filtered.forEach(schedule => {

        const card =
            document.createElement("div");

        card.className =
            "schedule-card";


        card.innerHTML = `

            <div class="schedule-info">

                <div class="schedule-type">
                    ${schedule.type}
                </div>

                <h3>
                    ${schedule.time}
                </h3>

                <p>
                    ${schedule.note || "ไม่มีรายละเอียด"}
                </p>

            </div>

            <div class="schedule-actions">

                <button
                    onclick="toggleComplete(${schedule.id})">

                    ${
                        schedule.completed
                        ? "✅ เสร็จแล้ว"
                        : "☐ ยังไม่ซ้อม"
                    }

                </button>

                <button
                    onclick="deleteSchedule(${schedule.id})">

                    🗑️

                </button>

            </div>

        `;


        list.appendChild(card);

    });

}


function calculateStreak() {

    const completedDates =
        [...new Set(
            schedules
                .filter(s => s.completed)
                .map(s => s.date)
        )];


    if (completedDates.length === 0) {

        return 0;

    }


    completedDates.sort();


    let streak = 0;

    const today =
        new Date();


    today.setHours(
        0, 0, 0, 0
    );


    let current =
        today;


    while (true) {

        const dateString =
            formatDate(current);


        if (
            completedDates.includes(dateString)
        ) {

            streak++;

            current =
                new Date(current);

            current.setDate(
                current.getDate() - 1
            );

        } else {

            break;

        }

    }


    return streak;

}


function updateStreak() {

    const streak =
        calculateStreak();


    const element =
        document.getElementById("streak");


    const message =
        document.getElementById("streakMessage");


    if (element) {

        element.textContent =
            streak;

    }


    if (message) {

        if (streak === 0) {

            message.textContent =
                "เริ่มสร้าง Streak กันเลย! 💪";

        } else if (streak < 3) {

            message.textContent =
                "เริ่มต้นได้ดี! ไปต่อกัน 🔥";

        } else if (streak < 7) {

            message.textContent =
                "ฟอร์มกำลังมา! รักษา Streak ไว้ 🔥";

        } else {

            message.textContent =
                "สุดยอด! คุณกำลังรักษาความสม่ำเสมอ 🏆";

        }

    }

}
/* ========================
   V6 DASHBOARD
======================== */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
}

.stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
}

.stat-card span {
    font-size: 25px;
}

.stat-card p {
    color: var(--muted);
    margin: 12px 0 5px;
    font-size: 14px;
}

.stat-card h3 {
    font-size: 32px;
    margin: 0;
}

.stat-card small {
    color: var(--muted);
}

.chart-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 22px;
}

.chart-title {
    margin-bottom: 25px;
}

.chart-title h3 {
    margin-top: 5px;
}

.training-chart {
    height: 190px;
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 10px;
    padding-top: 20px;
}

.chart-column {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
}

.chart-bar {
    width: 100%;
    max-width: 45px;
    min-height: 5px;
    background: var(--orange);
    border-radius: 8px 8px 3px 3px;
    transition: 0.3s;
}

.chart-bar:hover {
    transform: scaleY(1.05);
}

.chart-value {
    font-size: 12px;
    margin-bottom: 5px;
}

.chart-label {
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
}

@media (max-width: 700px) {

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .stat-card {
        padding: 16px;
    }

    .stat-card h3 {
        font-size: 27px;
    }

    .training-chart {
        height: 160px;
    }

}

// เริ่มต้น Calendar

renderCalendar();

updateStreak();
