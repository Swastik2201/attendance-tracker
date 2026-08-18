function SubjectList({ subjects, onDelete }) {
    return (
        <div>
            <h2>Subjects</h2>

            {subjects.length === 0 ? (
                <p>No subjects added yet.</p>
            ) : (
                <ul>
                    {subjects.map((subject) => (
                        <li key={subject.id}>
                            <span>
                                {subject.name} ({subject.code})
                            </span>

                            <button onClick={() => onDelete(subject.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SubjectList;