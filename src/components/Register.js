import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth } from '../utils/Auth.js'

function Register({ onInfoStatus, onInfoOpen, onLoggedUser }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!email || !password) {
      return
    }
    auth
      .register(email, password)
      .then((res) => {
        onLoggedUser(email, password)
        onInfoOpen(true)
        onInfoStatus(true)
        navigate('/sign-in', { replace: true })
      })
      .catch(() => {
        console.error()
        onInfoOpen(true)
        onInfoStatus(false)
      })
  }

  return (
    <section className="authorization">
      <h2 className="authorization__title">Регистрация</h2>
      <form className="authorization__form" onSubmit={handleSubmit} name="register">
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          id="register-email"
          className="authorization__input"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <span className="authorization__error">#</span>

        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          id="register-password"
          className="authorization__input"
          type="password"
          name="password"
          placeholder="Пароль"
          required
        />
        <span className="authorization__error">#</span>

        <button className="authorization__submit hover" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <Link className="authorization__signin hover" to="/sign-in">
        Уже зарегистрированы? Войти
      </Link>
    </section>
  )
}

export default Register
