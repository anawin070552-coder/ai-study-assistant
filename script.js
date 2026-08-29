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
