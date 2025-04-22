import { NavLink } from 'react-router-dom'

type Props = {}

const About = (props: Props) => {


  return (
    <div>
        <h1>About page</h1>
        <NavLink to="/">Go to the home page</NavLink>
    </div>
  )
}

export default About