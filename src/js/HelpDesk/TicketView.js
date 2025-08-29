import { formatDate } from '../utils/dataUtils';

/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(container, ticketServiceClass = 'ticket-service') {
    this.container = container;
    this.ticketServiceClass = ticketServiceClass;
  }

  /**
   * Отображает список тикетов на странице с использованием HTML-разметки
   * @param {Ticket[]} tickets - список тикетов
   */
  render(tickets) {
    this.container.replaceChildren();
    tickets.forEach((ticket) => {
      const ticketItem = this._createTicketItem(ticket);
      this.container.append(ticketItem);
    });
  }

  /**
   * Создает HTML-разметку для одного тикета
   * @param {Ticket} ticket - объект с информацией о тикете
   * @return {HTMLElement} HTML-элемент тикета
   */
  _createTicketItem(ticket) {
    if (!ticket || typeof ticket !== 'object') {
      console.warn('Invalid ticket data', ticket);
      return null;
    }

    const ticketItem = document.createElement('li');
    ticketItem.className = `${this.ticketServiceClass}__ticket-item`;

    const ticketStatus = document.createElement('input');
    ticketStatus.className = `${this.ticketServiceClass}__ticket-checkbox`;
    ticketStatus.id = ticket.id;
    ticketStatus.type = 'checkbox';
    ticketStatus.checked = Boolean(ticket.status);

    const ticketInfo = this._createTicketTextInfo(ticket);
    const ticketCreatedAt = this._createTicketCreatedAt(ticket.created);
    const ticketBtns = this._createTicketBtns();

    ticketItem.append(ticketStatus, ticketInfo, ticketCreatedAt, ticketBtns);

    return ticketItem;
  }

  /**
   * Создает HTML-разметку для текстовой информации о тикете
   * @param {Ticket} ticket - объект с информацией о тикете
   * @return {HTMLElement} HTML-элемент информации о тикете
   */
  _createTicketTextInfo(ticket) {
    const ticketInfo = document.createElement('div');
    ticketInfo.className = `${this.ticketServiceClass}__ticket-text-info`;

    const ticketShortDesc = document.createElement('p');
    ticketShortDesc.className = `${this.ticketServiceClass}__ticket-short-desc`;
    ticketShortDesc.textContent = ticket.name;

    ticketInfo.append(ticketShortDesc);

    if (ticket.description) {
      const ticketFullDesc = document.createElement('p');
      ticketFullDesc.className = `${this.ticketServiceClass}__ticket-full-desc`;
      ticketFullDesc.textContent = ticket.description;
      ticketInfo.append(ticketFullDesc);
    }

    return ticketInfo;
  }

  /**
   * Создает HTML-разметку для даты создания тикета
   * @param {Date} date - дата создания тикета
   * @return {HTMLElement} HTML-элемент даты создания тикета
   */
  _createTicketCreatedAt(date) {
    const ticketCreatedAt = document.createElement('time');
    ticketCreatedAt.className = `${this.ticketServiceClass}__ticket-created`;
    ticketCreatedAt.textContent = formatDate(date);

    return ticketCreatedAt;
  }

  /**
   * Создает HTML-разметку для кнопок управления тикетом
   * @return {HTMLElement} HTML-элемент кнопок управления тикетом
   */
  _createTicketBtns() {
    const btnContainer = document.createElement('div');
    btnContainer.className = `${this.ticketServiceClass}__ticket-actions`;

    const updateTicketBtn = this._createActionButtonHandler('edit');
    const deleteTicketBtn = this._createActionButtonHandler('delete');

    // Добавляем кнопки в контейнер
    btnContainer.append(updateTicketBtn, deleteTicketBtn);

    return btnContainer;
  }

  /**
   * Обработчик создания HTML-элемента кнопки
   * @param {string} type - тип необходимой для создания кнопки
   * @return {HTMLElement} HTML-элемент кнопки с выбранным типом
   */
  _createActionButtonHandler(type) {
    const icons = { edit: 'edit', delete: 'delete' };
    const labels = { edit: 'Редактировать', delete: 'Удалить' };
    return this._createButton(icons[type], `${this.ticketServiceClass}__${type}-ticket-btn`, '', labels[type]);
  }

  /**
   * Создает HTML-элемент кнопки
   *
   * @param {string} iconName - имя иконки
   * @param {string} btnClassName - класс кнопки
   * @param {string} text - текст кнопки
   *
   * @return {HTMLElement} HTML-элемент кнопки
   */
  _createButton(iconName = '', btnClassName = '', text = '', ariaLabel = '') {
    const button = document.createElement('button');
    button.className = `${this.ticketServiceClass}__ticket-btn ${btnClassName}`;
    button.textContent = text;

    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    } else if (!text) {
      button.setAttribute('aria-label', iconName);
    }

    if (iconName) {
      const icon = this._createIcon(iconName);
      button.prepend(icon);
    }

    return button;
  }

  /**
   * Создает HTML-элемент иконки
   * @param {string} iconName - имя иконки
   * @return {HTMLElement} HTML-элемент иконки
   */
  _createIcon(iconName) {
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = iconName;

    return icon;
  }
}
