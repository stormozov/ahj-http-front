import TicketForm from './TicketForm';
import TicketView from './TicketView';

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }

    this.container = container;
    this.ticketService = ticketService;
    this.ticketView = new TicketView(this.container);
    this.ticketForm = new TicketForm(this._handleFormSubmit.bind(this), this._handleFormCancel.bind(this));
  }

  init() {
    if (this.ticketService) {
      this.ticketService._errorCallback = this.showErrorDialog.bind(this);
    }

    this.renderTickets();
    this._setupEventListeners();
  }

  renderTickets() {
    this.container.innerHTML = '';
    const cachedTickets = JSON.parse(localStorage.getItem('tickets'));

    if (cachedTickets) {
      this.ticketView.render(cachedTickets);
    } else {
      this.ticketService.list((response) => {
        this.ticketView.render(response);
        localStorage.setItem('tickets', JSON.stringify(response));
      });
    }
  }

  /**
   * Настраивает обработчики событий
   */
  _setupEventListeners() {
    // Обработчик клика по кнопке добавления
    const addBtn = document.querySelector('.ticket-service__add-ticket-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.ticketForm.show());
    }

    // Обработчик клика по кнопке редактирования
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.ticket-service__update-ticket-btn')) {
        const ticketItem = e.target.closest('.ticket-service__ticket-item');
        const ticketId = ticketItem.querySelector('input[type="checkbox"]').id;
        this._handleEditTicket(ticketId);
      }
    });

    // Обработчик клика по кнопке удаления
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.ticket-service__delete-ticket-btn')) {
        const ticketItem = e.target.closest('.ticket-service__ticket-item');
        const ticketName = ticketItem.querySelector('.ticket-service__ticket-short-desc').textContent;
        const ticketId = ticketItem.querySelector('input[type="checkbox"]').id;

        console.log(ticketId, ticketName);

        this._handleDeleteTicket(ticketId, ticketName);
      }
    });

    // Обработчик изменения состояния чекбокса
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('ticket-service__ticket-checkbox')) {
        const ticketId = e.target.id;
        const status = e.target.checked;
        this._handleStatusChange(ticketId, status);
      }
    });
  }

  /**
   * Обрабатывает отправку формы
   * @param {Object} ticketData - данные тикета
   * @param {boolean} isEditMode - режим редактирования
   */
  _handleFormSubmit(ticketData, isEditMode) {
    if (isEditMode) {
      this.ticketService.update(ticketData.id, ticketData, (response) => {
        if (response) this.renderTickets();
      });
    } else {
      this.ticketService.create(ticketData, (response) => {
        if (response) this.renderTickets();
      });
    }
  }

  /**
   * Обрабатывает отмену формы
   */
  _handleFormCancel() {
    console.log('Form cancelled');
  }

  /**
   * Обрабатывает редактирование тикета
   * @param {string} ticketId - ID тикета
   */
  _handleEditTicket(ticketId) {
    this.ticketService.get(ticketId, (ticket) => {
      if (ticket) this.ticketForm.show(ticket);
    });
  }

  /**
   * Обрабатывает изменение статуса тикета
   * @param {string} ticketId - ID тикета
   * @param {boolean} status - новый статус
   */
  _handleStatusChange(ticketId, status) {
    this.ticketService.update(ticketId, { status }, (response) => {
      if (response) console.log('Status updated successfully');
    });
  }

  /**
   * Обрабатывает удаление тикета
   * @param {string} ticketId - ID тикета
   * @param {string} ticketName - Название тикета
   */
  _handleDeleteTicket(ticketId, ticketName) {
    // Создаем модальное окно для подтверждения удаления
    const confirmationModal = this._createConfirmationModal(ticketName, () => {
      this.ticketService.delete(ticketId, (response) => {
        if (response) this.renderTickets();
      });
    });
    document.body.appendChild(confirmationModal);
  }

  /**
   * Создает модальное окно для подтверждения удаления
   *
   * @param {string} ticketName - Название тикета
   * @param {Function} onConfirm - Функция обратного вызова при подтверждении
   *
   * @return {HTMLElement} HTML-элемент модального окна для подтверждения удаления
   */
  _createConfirmationModal(ticketName, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal modal--delete';
    modal.innerHTML = `
        <div class="modal__overlay"></div>
        <div class="modal__content">
          <div class="modal__header">
            <h2 class="modal__title">Подтверждение удаления</h2>
            <button class="modal__close-btn" type="button">×</button>
          </div>
          <div class="modal__body">
            <p>Тикет: <span>${ticketName}</span></p>
            <p>Вы уверены, что хотите удалить этот тикет?</p>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-secondary" id="cancelBtn">Отмена</button>
            <button type="button" class="btn btn-primary" id="confirmBtn">Удалить</button>
          </div>
        </div>
      `;

    modal.querySelector('#confirmBtn').addEventListener('click', () => {
      onConfirm();
      modal.remove();
    });

    modal.querySelector('#cancelBtn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.modal__close-btn').addEventListener('click', () => {
      modal.remove();
    });

    return modal;
  }

  /**
   * Displays an error dialog with the provided message
   * @param {string} message - The error message to display
   */
  showErrorDialog(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__overlay"></div>
      <div class="modal__content">
        <div class="modal__header">
          <h2 class="modal__title">Ошибка</h2>
          <button class="modal__close-btn" type="button">×</button>
        </div>
        <div class="modal__body">
          <p>${message}</p>
        </div>
        <div class="modal__footer">
          <button type="button" class="btn btn-primary" id="closeBtn">Закрыть</button>
        </div>
      </div>
    `;

    modal.querySelector('#closeBtn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.modal__close-btn').addEventListener('click', () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }
}
