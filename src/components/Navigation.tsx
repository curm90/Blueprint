import { Link } from '@tanstack/react-router'

export default function Navigation() {
  return (
    <nav>
      <ul className="flex justify-between p-4 border-b">
        <div>
          <Link to="/">
            <div className="flex items-center gap-2">
              <img
                src="/logo192.png"
                alt="Blueprint Logo"
                className="h-8 w-8"
              />
              <li>Blueprint</li>
            </div>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/">
            <li>Today</li>
          </Link>
          <Link to="/progress">
            <li>Progress</li>
          </Link>
        </div>
      </ul>
    </nav>
  )
}
