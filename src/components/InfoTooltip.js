import { usePopupClose } from '../hooks/usePopupClose'
import imgOk from '../images/svg/auth-ok.svg'
import imgNo from '../images/svg/auth-no.svg'

function InfoTooltip({ status, isOpen, onClose }) {
  usePopupClose(isOpen, onClose)

  return (
    <section className={`popup info popup_${isOpen ? 'opened' : ''}`}>
      <div className="popup__container">
        <button onClick={onClose} className="popup__close hover" type="button" aria-label="Кнопка закрыть." />
        <img
          className="info__img"
          src={status ? imgOk : imgNo}
          alt={status ? 'OK' : 'Что то пошло не так!'}
        />
        <h2 className="info__title">
          {status ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h2>
      </div>
    </section>
  )
}

export default InfoTooltip
