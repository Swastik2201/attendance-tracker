import { useState } from "react";

function AttendanceCalendar() {

    const [currentDate, setCurrentDate] = useState(
        new Date(2026, 7, 1)
    );

    const [attendanceRecords, setAttendanceRecords] = useState([
        {
            date: "2026-08-14",
            status: "present"
        },
        {
            date: "2026-08-15",
            status: "absent"
        },
        {
            date: "2026-08-16",
            status: "present"
        },
        {
            date: "2026-08-20",
            status: "present"
        }
    ]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    function getAttendanceStatus(date) {

        const record = attendanceRecords.find(
            (record) => record.date === date
        );

        return record ? record.status : "no-record";
    }

    function previousMonth() {

        setCurrentDate(
            new Date(year, month - 1, 1)
        );
    }

    function nextMonth() {

        setCurrentDate(
            new Date(year, month + 1, 1)
        );
    }

    function getStatusClass(status) {

        if (status === "present") {
            return "present";
        }

        if (status === "absent") {
            return "absent";
        }

        return "no-record";
    }

    function handleDayClick(date, status) {

        alert(
            `${date}\nStatus: ${status}`
        );
    }

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <div className="calendar">

            <div className="calendar-header">

                <button onClick={previousMonth}>
                    &lt;
                </button>

                <h2>
                    {monthName} {year}
                </h2>

                <button onClick={nextMonth}>
                    &gt;
                </button>

            </div>

            <div className="weekdays">

                {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat"
                ].map((day) => (
                    <div key={day}>
                        {day}
                    </div>
                ))}

            </div>

            <div className="calendar-grid">

                {calendarDays.map((day, index) => {

                    if (day === null) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="calendar-day empty"
                            />
                        );
                    }

                    const date =
                        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    const status = getAttendanceStatus(date);

                    return (
                        <button
                            key={date}
                            className={`calendar-day ${getStatusClass(status)}`}
                            onClick={() =>
                                handleDayClick(date, status)
                            }
                        >
                            {day}
                        </button>
                    );
                })}

            </div>

            <div className="legend">

                <span>
                    🟢 Present
                </span>

                <span>
                    🔴 Absent
                </span>

                <span>
                    ⚪ No record
                </span>

            </div>

        </div>
    );
}

export default AttendanceCalendar;