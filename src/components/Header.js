import headerLogo from '../images/svg/logo.svg'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

function Header({ email, loggedIn, handleLogout }) {
  const navigate = useNavigate()

  function handleExit() {
    localStorage.removeItem('token')
    handleLogout()
    navigate('/sign-in', { replace: true })
  }
  return (
    <header className="header">
      <a className="header__link" href="#!">
        <img className="header__logo" src={headerLogo} alt="Логотип сайта." />
      </a>
      <Routes>
        <Route
          path="/sign-up"
          element={
            <Link className="header__auth hover" to="/sign-in">
              Войти
            </Link>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Link className="header__auth hover" to="/sign-up">
              Регистрация
            </Link>
          }
        />
      </Routes>
      {loggedIn && (
        <nav className="heander__nav">
          <div className="header__email">{email}</div>
          <button className="header__signout hover" onClick={handleExit}>
            Выйти
          </button>
        </nav>
      )}
    </header>
  )
}

export default Header
