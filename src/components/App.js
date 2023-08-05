import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { api } from '../utils/api.js'
import { auth } from '../utils/Auth.js'
import { CurrentUserContext, user } from '../contexts/CurrentUserContext.js'
import ProtectedRoute from './ProtectedRoute.js'
import Header from './Header.js'
import Main from './Main.js'
import Footer from './Footer.js'
import PopupWithForm from './PopupWithForm.js'
import ImagePopup from './ImagePopup.js'
import EditAvatarPopup from './EditAvatarPopup.js'
import EditProfilePopup from './EditProfilePopup.js'
import AddPlacePopup from './AddPlacePopup.js'
import InfoTooltip from './InfoTooltip.js'
import Register from './Register.js'
import Login from './Login.js'

export const AppContext = React.createContext()

function App() {
  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [cards, setCards] = useState([])
  const [email, setEmail] = useState('')

  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false)
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [infoStatus, setInfoStatus] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const [loggedUser, setLoggedUser] = useState({ email: '', password: '' })

  //------authorization----------------
  function handleRegister(newEmail, newPassword) {
    return auth
      .register(newEmail, newPassword)
      .then(() => {
        setLoggedUser((prev) => {
          return {
            ...prev,
            email: newEmail,
            password: newPassword,
          }
        })
        setInfoMessage('Вы успешно зарегистрировались!')
        setInfoStatus(true)
        setIsInfoOpen(true)
        navigate('/sign-in', { replace: true })
      })
      .catch(() => {
        console.error()
        setInfoMessage('Что-то пошло не так! Попробуйте ещё раз.')
        setIsInfoOpen(true)
        setInfoStatus(false)
      })
  }

  function handleLogin(email, password) {
    return auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true)
          navigate('/', { replace: true })
        }
      })
      .catch(() => {
        console.error()
        setInfoMessage('Что-то пошло не так! Попробуйте ещё раз.')
        setIsInfoOpen(true)
        setInfoStatus(false)
      })
  }

  function handleSignOut() {
    localStorage.removeItem('token')
    setLoggedIn(false)
    navigate('/sign-in', { replace: true })
  }

  function tokenCheck() {
    const token = localStorage.getItem('token')

    if (token) {
      auth
        .getData(token)
        .then((res) => {
          setEmail(res.data.email)
          setLoggedIn(true)
          navigate('/', { replace: true })
        })
        .catch(console.error)
    }
  }

  useEffect(() => {
    tokenCheck()
  }, [loggedIn])
  //-----------------------------------------

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserData()
        .then((user) => {
          setCurrentUser(user)
        })
        .catch(console.error)

      api
        .getInitialCards()
        .then((initialCards) => {
          setCards(initialCards)
        })
        .catch(console.error)
    }
  }, [loggedIn])

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id)

    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((prev) => prev.map((prevCard) => (prevCard._id === card._id ? newCard : prevCard)))
        })
        .catch(console.error)
    } else {
      api
        .putLike(card._id)
        .then((newCard) => {
          setCards((prev) => prev.map((prevCard) => (prevCard._id === card._id ? newCard : prevCard)))
        })
        .catch(console.error)
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((prev) => prev.filter((prevCard) => prevCard._id !== card._id))
      })
      .catch(console.error)
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false)
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setIsInfoOpen(false)

    setSelectedCard(null)
  }

  function handleUpdateUser(userData) {
    setIsLoading(true)
    api
      .editUserInfo(userData)
      .then((user) => {
        setCurrentUser((prev) => {
          return { ...prev, name: user.name, about: user.about }
        })
        closeAllPopups()
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true)
    api
      .setNewAvatar(avatar)
      .then((user) => {
        setCurrentUser((prev) => {
          return { ...prev, avatar: user.avatar }
        })
        closeAllPopups()
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true)
    api
      .setNewCard(card)
      .then((newCard) => {
        setCards((prev) => [newCard, ...prev])
        closeAllPopups()
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  return (
    <AppContext.Provider value={{ isLoading, closeAllPopups }}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="App">
          <div className="container">
            <Header email={email} loggedIn={loggedIn} onSignOut={handleSignOut} />

            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    component={Main}
                    loggedIn={loggedIn}
                    cards={cards}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                }
              />
              <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
              <Route path="/sign-in" element={<Login onLogin={handleLogin} loggedUser={loggedUser} />} />
            </Routes>

            {loggedIn && <Footer />}

            <InfoTooltip status={infoStatus} message={infoMessage} isOpen={isInfoOpen} />

            <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} />

            <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} />

            <AddPlacePopup onAddPlaceSubmit={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} />

            <PopupWithForm title="Вы уверены?" name="confirmation" buttonText="Да" />

            <ImagePopup onClose={closeAllPopups} card={selectedCard} />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  )
}

export default App
