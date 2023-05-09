import { NavLink } from "react-router-dom"

export default function NotFound() {
  return (
    <div>
      <h2>You seem lost my friend.</h2>

      <h4>Let's return <NavLink to="/">home</NavLink>.</h4>
    </div>
  )
}