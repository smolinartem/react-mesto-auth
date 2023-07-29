import headerLogo from '../images/svg/logo.svg'

function Header() {
  return (
    <header className="header">
      <a className="header__link" href="#!">
        <img className="header__logo" src={headerLogo} alt="Логотип сайта." />
      </a>
    </header>
  )
}

export default Header
