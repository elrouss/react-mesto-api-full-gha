import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.js';

import { registerUser } from '../../utils/auth.js';
import { authorizeUser } from '../../utils/auth.js';
import { getContent } from '../../utils/auth.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';
import { api } from '../../utils/api.js';

import Login from '../Login/Login.js';
import Register from '../Register/Register.js';

import Preloader from '../Preloader/Preloader.js';

import Header from '../Header/Header.js';
import Main from '../Main/Main.js';
import Footer from '../Footer/Footer.js';

import PageNotFound from '../PageNotFound/PageNotFound.js';

import InfoTooltip from '../InfoTooltip/InfoTooltip.js';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup.js';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup.js';
import ImagePopup from '../ImagePopup/ImagePopup.js';
import ConfirmCardDeletionPopup from '../ConfirmCardDeletionPopup/ConfirmCardDeletionPopup.js';

export default function App() {
  const navigate = useNavigate();

  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isAppLoading, setIsAppLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    _id: '',
    email: '',
    name: '',
    about: '',
    avatar: ''
  });

  const [userData, setUserData] = useState({
    _id: '',
    email: ''
  });

  const [selectedCard, setSelectedCard] = useState({});
  const [activeCardId, setActiveCardId] = useState('');
  const [cards, setCards] = useState([]);

  const [isActiveBurgerMenu, setIsActiveBurgerMenu] = useState(false);

  const [isInfoTooltipOpened, setIsInfoTooltipOpened] = useState(false);
  const [isEditProfilePopupOpened, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpened, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpened, setEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpened, setIsImagePopupOpened] = useState(false);
  const [isConfirmationCardDeletionPopupOpened, setConfirmationCardDeletionPopupOpened] = useState(false);

  const checkToken = useCallback(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      setIsAppLoading(true);

      getContent(jwt)
        .then((res) => {
          const { _id, email } = res;
          const userData = {
            _id,
            email
          };
          setUserData(userData);
          handleLogin();
          navigate('/', { replace: true });
        })
        .catch((err) => {
          console.log(`Ошибка в процессе проверки токена пользователя и получения личных данных: ${err}`);
        })
        .finally(() => {
          setIsAppLoading(false);
        })
    };
  }, [navigate]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  useEffect(() => {
    if (isLoggedIn) {
      setIsPageLoading(true);

      Promise.all([api.getUserInfo(), api.getPhotocards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка в процессе загрузки данных пользователя и галереи карточек: ${err}`);
        })
        .finally(() => {
          setIsPageLoading(false);
        })
    };
  }, [isLoggedIn]);

  function handleLogin() {
    setIsLoggedIn(true);
  };

  function toggleBurgerMenu() {
    setIsActiveBurgerMenu(!isActiveBurgerMenu);
  };

  function openInfoTooltip() {
    setIsInfoTooltipOpened(true);
  };

  function openEditProfilePopup() {
    setEditProfilePopupOpen(true);
  };

  function openAddPlacePopup() {
    setAddPlacePopupOpen(true);
  };

  function openEditAvatarPopup() {
    setEditAvatarPopupOpen(true);
  };

  function openConfirmationCardDeletionPopup(card) {
    setConfirmationCardDeletionPopupOpened(true);
    setActiveCardId(card._id);
  };

  function handleCardClick(cardData) {
    setSelectedCard(cardData);
    setIsImagePopupOpened(true);
  };

  const closeAllPopups = useCallback(() => {
    setIsInfoTooltipOpened(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setConfirmationCardDeletionPopupOpened(false);
    setIsImagePopupOpened(false);
  }, []);

  useEffect(() => {
    if (!isImagePopupOpened) {
      setTimeout(() => setSelectedCard({}), 400);
    };
  }, [isImagePopupOpened]);

  function closePopupsOnOutsideClick(evt) {
    const { target } = evt;
    const checkSelector = selector => target.classList.contains(selector);

    if (checkSelector('popup_opened') || checkSelector('popup__closing-button')) {
      closeAllPopups();
    };
  };

  const popupPackProps = {
    onClose: closeAllPopups,
    closePopupsOnOutsideClick: closePopupsOnOutsideClick,
    isProcessLoading: isProcessLoading
  };

  function handleUserRegistration(data) {
    setIsProcessLoading(true);
    const { email, password } = data;

    registerUser(email, password)
      .then((res) => {
        if (res) {
          setIsRegistrationSuccess(true);
          openInfoTooltip();
        };

        if (!res) {
          openInfoTooltip();
        };
      })
      .catch((err) => {
        console.log(`Ошибка в процессе регистрации пользователя на сайте: ${err}`);
      })
      .finally(() => {
        setIsProcessLoading(false);
      })
  };

  useEffect(() => {
    if (isInfoTooltipOpened && isRegistrationSuccess) {
      setTimeout(() => {
        navigate('/signin', { replace: false });
        closeAllPopups();
      }, 1200);

      setTimeout(() => {
        setIsRegistrationSuccess(false);
      }, 1500);
    };

    return () => clearTimeout(setTimeout);
  }, [isInfoTooltipOpened, isRegistrationSuccess, navigate, closeAllPopups, setIsRegistrationSuccess]);

  function handleUserAuthorization(data) {
    setIsProcessLoading(true);
    const { email, password } = data;

    authorizeUser(email, password)
      .then((jwt) => {
        if (jwt) {
          handleLogin();
          navigate('../', { replace: true });
        };
      })
      .catch((err) => {
        openInfoTooltip();
        console.log(`Ошибка в процессе авторизации пользователя на сайте: ${err}`);
      })
      .finally(() => {
        setIsProcessLoading(false);
      })
  }

  function handleUpdateUser(data) {
    if (data.name === currentUser.name && data.about === currentUser.about) {
      closeAllPopups();
    } else {
      setIsProcessLoading(true);

      api.setUserInfo(data.name, data.about)
        .then((user) => {
          setCurrentUser(user);
          closeAllPopups();
        })
        .catch((err) => {
          console.log(`Ошибка в процессе редактирования информации пользователя: ${err}`);
        })
        .finally(() => {
          setIsProcessLoading(false);
        })
    };
  };

  function handleUpdateAvatar(data) {
    setIsProcessLoading(true);

    api.setUserAvatar(data.avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в процессе изменения аватара пользователя: ${err}`);
      })
      .finally(() => {
        setIsProcessLoading(false);
      })
  };

  function handleAddPlaceSubmit(data) {
    setIsProcessLoading(true);

    api.addNewСard(data.name, data.link)
      .then((card) => {
        setCards([...cards, card]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в процессе добавления новой карточки в галерею: ${err}`);
      })
      .finally(() => {
        setIsProcessLoading(false);
      })
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(user => user._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((cardLike) => {
        setCards(state => state.map(c => c._id === card._id ? cardLike : c));
      })
      .catch((err) => {
        console.log(`Ошибка в процессе добавления/снятия лайка карточки в галерее: ${err}`);
      })
  };

  function handleCardDelete(activeCardId) {
    setIsProcessLoading(true);

    api.deleteСard(activeCardId)
      .then(() => {
        setCards(state => state.filter(c => c._id !== activeCardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка в процессе удаления карточки из галереи: ${err}`);
      })
      .finally(() => {
        setIsProcessLoading(false);
      })
  };

  if (isAppLoading) {
    return null;
  };

  return (
    <div className={`page ${isActiveBurgerMenu && 'active'}`}>
      <Routes>
        <Route path='/' element={
          <Header
            isActive={isActiveBurgerMenu}
            onActive={toggleBurgerMenu}
            userData={userData}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
            setCurrentUser={setCurrentUser}
            isActiveBurgerMenu={isActiveBurgerMenu}
            toggleBurgerMenu={toggleBurgerMenu}
          />
        }>
          <Route
            index
            element={
              <>
                <ProtectedRoute isLoggedIn={isLoggedIn} />
                {isPageLoading
                  ? <Preloader />
                  : <>
                    <CurrentUserContext.Provider value={currentUser}>
                      <Main
                        onEditProfile={openEditProfilePopup}
                        onAddPlace={openAddPlacePopup}
                        onEditAvatar={openEditAvatarPopup}
                        onConfirmationCardDeletion={openConfirmationCardDeletionPopup}
                        onCardClick={handleCardClick}

                        cards={cards}
                        onCardLike={handleCardLike}
                      />
                    </CurrentUserContext.Provider>

                    <Footer />

                    <CurrentUserContext.Provider value={currentUser}>
                      <EditProfilePopup
                        onUpdateUser={handleUpdateUser}
                        isOpened={isEditProfilePopupOpened}
                        popupPackProps={popupPackProps}
                      />

                      <EditAvatarPopup
                        onUpdateAvatar={handleUpdateAvatar}
                        isOpened={isEditAvatarPopupOpened}
                        popupPackProps={popupPackProps}
                      />

                      <AddPlacePopup
                        onAddPlace={handleAddPlaceSubmit}
                        isOpened={isAddPlacePopupOpened}
                        popupPackProps={popupPackProps}
                      />

                      <ConfirmCardDeletionPopup
                        activeCardId={activeCardId}

                        onCardDelete={handleCardDelete}
                        isOpened={isConfirmationCardDeletionPopupOpened}
                        popupPackProps={popupPackProps}
                      />
                    </CurrentUserContext.Provider>

                    <ImagePopup
                      card={selectedCard}

                      isImagePopupOpened={isImagePopupOpened}
                      onClose={closeAllPopups}
                      closePopupsOnOutsideClick={closePopupsOnOutsideClick}
                    />
                  </>
                }
              </>
            }
          />
          <Route path='signin' element={
            <Login
              onAuthorization={handleUserAuthorization}
              isProcessLoading={isProcessLoading}
            />
          }
          />
          <Route path='signup' element={
            <Register
              onRegistration={handleUserRegistration}
              isProcessLoading={isProcessLoading}
            />
          }
          />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <InfoTooltip
        isSuccess={isRegistrationSuccess}
        isOpened={isInfoTooltipOpened}
        onClose={closeAllPopups}
        closePopupsOnOutsideClick={closePopupsOnOutsideClick}
      />
    </div>
  );
};
