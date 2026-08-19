import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import AttendanceCalendar from "./components/AttendanceCalendar";

function App() {
    return (
        <div>
            <Subjects />

            <hr />

            <SubjectDetail />

            <hr />

            <AttendanceCalendar />
        </div>
    );
}

export default App;

/* import SubjectDetail from "./pages/SubjectDetail";

function App() {
    return <SubjectDetail />;
}

export default App; 

*/