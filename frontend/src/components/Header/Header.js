import { Outlet, Link, useMatch, useNavigate } from 'react-router-dom';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import logo from '../../images/header__logo_theme_light.svg';

export default function Header({
  userData,
  isLoggedIn,
  setIsLoggedIn,
  setUserData,
  setCurrentUser,
  isActive,
  onActive,
  isActiveBurgerMenu,
  toggleBurgerMenu
}) {

  const windowWidth = useWindowDimensions();

  const href = useMatch({ path: `${window.location.pathname}`, end: false });
  const isLoginHref = href.pathname.endsWith('/signin');

  const navigate = useNavigate();

  const burgerElement = <span className="header__burger-line" />;

  function isDisplayMobileAndRootHref() {
    return windowWidth <= 696 && isLoggedIn;
  };

  function signUserOut() {
    if (isActiveBurgerMenu) {
      toggleBurgerMenu();
    };

    localStorage.removeItem('jwt');
    navigate('./signin', { replace: true });
    setIsLoggedIn(false);

    setUserData({
      _id: '',
      email: ''
    });

    setCurrentUser({
      _id: '',
      email: '',
      name: '',
      about: '',
      avatar: ''
    });
  };

  function renderHeaderMenu() {
    return (
      <div className={`header__data ${isDisplayMobileAndRootHref() && 'header__data_display_mobile'}`}>
        {
          isLoggedIn
            ? <>
              <p className='header__email'>{userData.email}</p>
              <button
                className='header__btn'
                type='button'
                aria-label='Выход из личного кабинета'
                onClick={signUserOut}
              >
                Выйти
              </button>
            </>
            : <Link
              className='header__btn'
              to={isLoginHref ? './signup' : './signin'}
            >
              {isLoginHref ? 'Регистрация' : 'Войти'}
            </Link>
        }
      </div>
    );
  };

  return (
    <>
      {isDisplayMobileAndRootHref() && renderHeaderMenu()}
      <header className="header">
        <img src={logo} alt="Логотип сайта &laquo;Mesto&raquo;" className="header__logo" />
        {
          isLoggedIn &&
          <button
            className={`header__burger ${isActive && 'active'}`}
            type="button"
            aria-label="Открытие меню с электронным адресом пользователя и кнопкой выхода из личного кабинета"
            onClick={onActive}
          >
            {burgerElement}
            {burgerElement}
            {burgerElement}
          </button>
        }
        {!isDisplayMobileAndRootHref() && renderHeaderMenu()}
      </header>
      <Outlet />
    </>
  );
};
