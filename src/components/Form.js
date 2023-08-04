function Form({ onSubmit, name, buttonText, children, className }) {
  return (
    <form onSubmit={onSubmit} className={`popup__form ${className}`} name={`popup-${name}`}>
      {children}
      <button className="popup__submit hover" type="submit">
        {buttonText}
      </button>
    </form>
  )
}

export default Form
