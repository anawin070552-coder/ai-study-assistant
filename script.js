function createPlan() {

    const subject = document.getElementById("subject").value;
    const examDate = document.getElementById("examDate").value;
    const studyTime = document.getElementById("studyTime").value;

    if (!subject || !examDate || !studyTime) {
        document.getElementById("plan").innerText =
            "⚠️ กรุณากรอกข้อมูลให้ครบ";
        return;
    }

    document.getElementById("plan").innerText =
        `📚 วิชา: ${subject}
📅 วันสอบ: ${examDate}
⏰ เวลาอ่าน: ${studyTime} ชั่วโมง

แนะนำให้แบ่งเวลาอ่านเป็นช่วง ๆ และพักระหว่างการอ่านนะ! 💪`;
}


function addTask() {

    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (task === "") {
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <input type="checkbox">
        ${task}
    `;

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}


function askAssistant() {

    const question =
        document.getElementById("question").value;

    if (question.trim() === "") {
        document.getElementById("answer").innerText =
            "ลองพิมพ์คำถามก่อนนะ 😊";
        return;
    }

    document.getElementById("answer").innerText =
        "🤖 คำแนะนำ: ลองแบ่งเนื้อหาเป็นหัวข้อเล็ก ๆ แล้วอ่านจากหัวข้อที่สำคัญก่อน จากนั้นลองทำโจทย์เพื่อเช็กความเข้าใจ";
}
let score = 0;
let quizAnswered = false;

function checkAnswer(answer) {

    if (quizAnswered) {
        return;
    }

    quizAnswered = true;

    if (answer === 10) {

        score = 1;

        document.getElementById("quizResult").innerText =
            "✅ ถูกต้อง! เก่งมาก";

    } else {

        document.getElementById("quizResult").innerText =
            "❌ ยังไม่ถูก ลองทบทวนอีกครั้งนะ";
    }

    document.getElementById("score").innerText = score;

    const progress = score * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("progressText").innerText =
        progress + "%";
}
