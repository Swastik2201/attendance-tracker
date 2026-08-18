import { useState } from "react";
import SubjectList from "../components/SubjectList";

function Subjects() {

    const [subjects, setSubjects] = useState([
        {
            id: 1,
            name: "Data Structures",
            code: "DS"
        },
        {
            id: 2,
            name: "Database Management Systems",
            code: "DBMS"
        }
    ]);

    const [subjectName, setSubjectName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");

    function addSubject() {

        if (subjectName.trim() === "" || subjectCode.trim() === "") {
            return;
        }

        const newSubject = {
            id: Date.now(),
            name: subjectName,
            code: subjectCode
        };

        setSubjects([...subjects, newSubject]);

        setSubjectName("");
        setSubjectCode("");
    }

    function deleteSubject(id) {
        setSubjects(
            subjects.filter((subject) => subject.id !== id)
        );
    }

    return (
        <div>
            <h1>My Subjects</h1>

            <div>
                <input
                    type="text"
                    placeholder="Subject name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Subject code"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                />

                <button onClick={addSubject}>
                    Add Subject
                </button>
            </div>

            <SubjectList
                subjects={subjects}
                onDelete={deleteSubject}
            />
        </div>
    );
}

export default Subjects;