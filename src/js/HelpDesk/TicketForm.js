/**
 *  Класс для создания формы создания/редактирования тикета
 * */
export default class TicketForm {
  constructor(onSubmit, onCancel) {
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.form = null;
    this.isEditMode = false;
    this.currentTicketId = null;
  }

  /**
   * Создает модальное окно с формой
   * @param {Ticket|null} ticket - объект тикета для редактирования или null для создания
   * @return {HTMLElement} HTML-элемент модального окна
   */
  createModal(ticket = null) {
    this.isEditMode = ticket !== null;
    this.currentTicketId = ticket ? ticket.id : null;
    const modalTitle = this.isEditMode ? 'Редактирование тикета' : 'Создание тикета';

    const modal = document.createElement('div');
    modal.className = 'modal';

    // Собираем контент модального окна
    modal.appendChild(this.createModalOverlay());
    modal.appendChild(this.createModalContent(modalTitle, ticket));

    this.form = modal.querySelector('#ticketForm');
    this._setupEventListeners(modal);

    return modal;
  }

  /**
   * Создает затемнение под модальным окном
   * @return {HTMLElement}
   */
  createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal__overlay';
    return overlay;
  }

  /**
   * Создает основное содержимое модального окна
   * @param {string} title - заголовок модального окна
   * @param {Ticket|null} ticket - объект тикета
   * @return {HTMLElement}
   */
  createModalContent(title, ticket) {
    const content = document.createElement('div');
    content.className = 'modal__content';

    content.innerHTML = `
    <header class="modal__header">
      <h2 class="modal__title">${title}</h2>
      <button class="modal__close-btn" type="button">×</button>
    </header>
    ${this.createFormHtml(ticket)}
  `;

    return content;
  }

  /**
   * Генерирует HTML формы
   * @param {Ticket|null} ticket - объект тикета
   * @return {string} HTML-код формы
   */
  createFormHtml(ticket) {
    const nameValue = ticket ? this.escapeHtml(ticket.name) : '';
    const descriptionValue = ticket ? this.escapeHtml(ticket.description || '') : '';
    const statusChecked = ticket && ticket.status ? 'checked' : '';
    const submitBtnText = this.isEditMode ? 'Обновить' : 'Добавить';

    return `
    <form class="modal__form" id="ticketForm">
      <div class="form-group">
        <label for="ticketName" class="form-label">Краткое описание</label>
        <input 
          type="text" 
          id="ticketName" 
          name="name" 
          class="form-input" 
          value="${nameValue}" 
          required
          placeholder="Введите краткое описание"
        >
      </div>
      <div class="form-group">
      <label for="ticketDescription" class="form-label">Подробное описание</label>
        <textarea 
          id="ticketDescription" 
          name="description" 
          class="form-input" 
          placeholder="Введите подробное описание (необязательно)"
        >${descriptionValue}</textarea>
      </div>
      ${this.isEditMode ? this.createStatusCheckboxHtml(statusChecked) : ''}
      <footer class="modal__footer">
        <button type="button" class="btn btn-secondary" id="cancelBtn">Отмена</button>
        <button type="submit" class="btn btn-primary">${submitBtnText}</button>
      </footer>
    </form>
  `;
  }

  /**
   * Генерирует HTML чекбокса статуса (только в режиме редактирования)
   * @param {string} checkedAttr - атрибут 'checked', если нужно
   * @return {string} HTML-элемент чекбокса
   */
  createStatusCheckboxHtml(checkedAttr) {
    return `
    <div class="form-group">
      <label class="form-checkbox">
        Статус тикета: 
        <input type="checkbox" name="status" ${checkedAttr}>
        <span class="form-checkbox-label">Выполнено</span>
      </label>
    </div>
  `;
  }

  /**
   * Экранирует HTML-символы для безопасного вывода
   * @param {string} str - строка, которую нужно экранировать
   * @return {string} экранированная строка
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Настраивает обработчики событий для модального окна
   * @param {HTMLElement} modal - элемент модального окна
   */
  _setupEventListeners(modal) {
    // Обработчик отправки формы
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    // Обработчик отмены
    const cancelBtn = modal.querySelector('#cancelBtn');
    const closeBtn = modal.querySelector('.modal__close-btn');
    const overlay = modal.querySelector('.modal__overlay');

    const closeModal = () => {
      modal.remove();
      if (this.onCancel) this.onCancel();
    };

    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /**
   * Обрабатывает отправку формы
   */
  _handleSubmit() {
    const formData = new FormData(this.form);
    const ticketData = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    if (this.isEditMode) {
      ticketData.status = formData.get('status') === 'on';
      ticketData.id = this.currentTicketId;
    }

    if (this.onSubmit) this.onSubmit(ticketData, this.isEditMode);

    // Закрываем модальное окно после отправки
    this.form.closest('.modal').remove();
  }

  /**
   * Показывает модальное окно
   * @param {Ticket|null} ticket - объект тикета для редактирования или null для создания
   */
  show(ticket = null) {
    const modal = this.createModal(ticket);
    document.body.appendChild(modal);

    // Фокусируемся на первом поле ввода
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  }
}
