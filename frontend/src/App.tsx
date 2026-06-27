import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, Route, Routes } from 'react-router-dom'
import MoviesList from './components/movies-list'
import Movie from './components/movies'
import AddReview from './components/add-reviews'
import Login, { type LoginFormData } from './components/login'



type User = LoginFormData;
type UserState = User | null;

function App() {
  const [user, setUser] = useState<UserState>(null);

  function login(data: User) {
    setUser(data);
  }
  return (
    <div className="App">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">Movie reviews</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              <Nav.Link as={Link} to="/login">{user ? 'Logout' : 'Login'}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id/review" element={<AddReview user={user} />} />
        <Route path="/movies/:id" element={<Movie user={user} />} />
        <Route path="/login" element={<Login login={login} />} />
      </Routes>

      </div>
  )
}


export default App
