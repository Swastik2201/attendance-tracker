import { useEffect, useState } from 'react'
import './App.css'

function getPercentage(attended, total) {
  if (!total) return 0
  return Math.round((attended / total) * 100)
}

function getStatus(percentage) {
  if (percentage >= 75) return 'safe'
  if (percentage >= 65) return 'warning'
  return 'critical'
}

function App() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAttendance() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/attendance/summary`
        )

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          )
        }

        const data = await response.json()

        setSubjects(data.summary || [])
      } catch (err) {
        console.error('Attendance API error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <main className="dashboard">
          <h2>Loading attendance...</h2>
          <p>Connecting to the attendance server.</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <main className="dashboard">
          <section className="alert">
            <div className="alert-icon">!</div>

            <div>
              <strong>Unable to load attendance</strong>
              <p>{error}</p>
              <p>
                Make sure the backend server is running on
                port 5000.
              </p>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const totalAttended = subjects.reduce(
    (sum, subject) => sum + subject.present,
    0
  )

  const totalClasses = subjects.reduce(
    (sum, subject) => sum + subject.total,
    0
  )

  const overallPercentage = getPercentage(
    totalAttended,
    totalClasses
  )

  const lowAttendance = subjects.filter(
    (subject) =>
      getPercentage(subject.present, subject.total) < 75
  )

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>

          <h1>Attendance Dashboard</h1>

          <p className="subtitle">
            Track your attendance and stay above the required percentage.
          </p>
        </div>

        <div className="student-badge">
          <div className="avatar">N</div>

          <div>
            <strong>Nitish</strong>
            <span>Student</span>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="summary-grid">
          <div className="summary-card overall-card">
            <div className="card-heading">
              <span>Overall Attendance</span>

              <span
                className={`status ${getStatus(overallPercentage)}`}
              >
                {overallPercentage >= 75 ? 'Good' : 'Attention'}
              </span>
            </div>

            <div className="percentage">
              {overallPercentage}%
            </div>

            <div className="progress-track large">
              <div
                className="progress-fill"
                style={{
                  width: `${overallPercentage}%`,
                }}
              />
            </div>

            <p className="card-description">
              {totalAttended} of {totalClasses} classes attended
            </p>
          </div>

          <div className="summary-card">
            <span className="summary-label">
              Total Classes
            </span>

            <strong>{totalClasses}</strong>

            <p>Classes conducted</p>
          </div>

          <div className="summary-card">
            <span className="summary-label">
              Classes Attended
            </span>

            <strong>{totalAttended}</strong>

            <p>Classes attended</p>
          </div>

          <div className="summary-card warning-card">
            <span className="summary-label">
              Need Attention
            </span>

            <strong>{lowAttendance.length}</strong>

            <p>Subjects below 75%</p>
          </div>
        </section>

        {lowAttendance.length > 0 && (
          <section className="alert">
            <div className="alert-icon">!</div>

            <div>
              <strong>Attendance Warning</strong>

              <p>
                You have {lowAttendance.length} subject
                {lowAttendance.length > 1 ? 's' : ''} below the
                required 75% attendance.
              </p>
            </div>
          </section>
        )}

        <section className="subjects-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                ATTENDANCE DETAILS
              </p>

              <h2>Subject-wise Attendance</h2>
            </div>

            <span className="required-label">
              Required: 75%
            </span>
          </div>

          <div className="subject-list">
            {subjects.map((subject) => {
              const percentage = getPercentage(
                subject.present,
                subject.total
              )

              const status = getStatus(percentage)

              return (
                <div
                  className="subject-card"
                  key={subject.subject}
                >
                  <div className="subject-top">
                    <div>
                      <h3>{subject.subject}</h3>

                      <p>
                        {subject.present} / {subject.total} classes
                      </p>
                    </div>

                    <div
                      className={`subject-percentage ${status}`}
                    >
                      {percentage}%
                    </div>
                  </div>

                  <div className="progress-track">
                    <div
                      className={`progress-fill ${status}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <div className="subject-bottom">
                    <span>
                      {status === 'safe' &&
                        '✓ Attendance is safe'}

                      {status === 'warning' &&
                        '⚠ Attendance needs attention'}

                      {status === 'critical' &&
                        '⚠ Critical attendance'}
                    </span>

                    <span>
                      {subject.total - subject.present} classes missed
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App