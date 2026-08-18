import { useState } from "react";

function SubjectDetail() {

    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");

    function markAttendance() {

        if (!date || !status) {
            alert("Please select a date and attendance status.");
            return;
        }

        alert(
            `Attendance marked!\nDate: ${date}\nStatus: ${status}`
        );
    }

    return (
        <div className="attendance-page">

            <h1>Mark Attendance</h1>

            <label>
                Date
            </label>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <h3>Attendance Status</h3>

            <div>
                <button
                    onClick={() => setStatus("present")}
                >
                    Present
                </button>

                <button
                    onClick={() => setStatus("absent")}
                >
                    Absent
                </button>
            </div>

            <p>
                Selected status:{" "}
                <strong>
                    {status || "None"}
                </strong>
            </p>

            <button onClick={markAttendance}>
                Mark Attendance
            </button>

        </div>
    );
}

export default SubjectDetail;