import { useState } from 'react'
import { auth } from '../utils/Auth.js'
import { useNavigate } from 'react-router-dom'

function Login({ handleLogin, loggedUser }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState(loggedUser.email)
  const [password, setPassword] = useState(loggedUser.password)

  function handleSubmit(event) {
    event.preventDefault()

    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail('')
          setPassword('')
          handleLogin()
          navigate('/', { replace: true })
        }
      })
      .catch(console.error)
  }
  return (
    <section className="authorization">
      <h2 className="authorization__title">Вход</h2>
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
          Войти
        </button>
      </form>
    </section>
  )
}

export default Login
