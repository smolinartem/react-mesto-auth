const BASE_URL = 'https://auth.nomoreparties.co/'

class Auth {
  constructor(url) {
    this._url = url
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json()
    } else {
      return Promise.reject(res.status)
    }
  }

  register(email, password) {
    return fetch(`${this._url}signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(this._handleResponse)
  }

  authorize(email, password) {
    return fetch(`${this._url}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(this._handleResponse)
      .then((data) => {
        console.log(data)
        if (data.token) {
          localStorage.setItem('token', data.token)
          return data
        }
      })
      .catch(console.error)
  }

  getData(token) {
    return fetch(`${this._url}users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse)
  }
}

export const auth = new Auth(BASE_URL)
