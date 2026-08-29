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
