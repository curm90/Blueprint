import { Link } from '@tanstack/react-router'

export default function Navigation() {
  return (
    <nav>
      <ul className="flex justify-between p-4 border-b">
        <div>
          <Link to="/">
            <li>Blueprint</li>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/">
            <li>Today</li>
          </Link>
          <Link to="/progress">
            <li>Progress</li>
          </Link>
          <Link to="/add-exercise">
            <li>Add Exercise</li>
          </Link>
        </div>
      </ul>
    </nav>
  )
}
