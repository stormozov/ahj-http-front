import { formatDate } from '../utils/dataUtils';

/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(container) {
    this.container = container;
  }

  /**
   * Отображает список тикетов на странице с использованием HTML-разметки
   * @param {Ticket[]} tickets - список тикетов
   */
  render(tickets) {
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
    const ticketItem = document.createElement('li');
    ticketItem.className = 'ticket-service__ticket-item';

    const ticketStatus = document.createElement('input');
    ticketStatus.className = 'ticket-service__ticket-checkbox';
    ticketStatus.id = ticket.id;
    ticketStatus.type = 'checkbox';
    ticketStatus.checked = ticket.status;

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
    ticketInfo.className = 'ticket-service__ticket-text-info';

    const ticketShortDesc = document.createElement('p');
    ticketShortDesc.className = 'ticket-service__ticket-short-desc';
    ticketShortDesc.textContent = ticket.name;

    ticketInfo.append(ticketShortDesc);

    if (ticket.description) {
      const ticketFullDesc = document.createElement('p');
      ticketFullDesc.className = 'ticket-service__ticket-full-desc';
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
    ticketCreatedAt.className = 'ticket-service__ticket-created';
    ticketCreatedAt.textContent = formatDate(date);

    return ticketCreatedAt;
  }

  /**
   * Создает HTML-разметку для кнопок управления тикетом
   * @return {HTMLElement} HTML-элемент кнопок управления тикетом
   */
  _createTicketBtns() {
    const btnContainer = document.createElement('div');
    btnContainer.className = 'ticket-service__ticket-actions';

    // Кнопка "Редактировать"
    const updateTicketBtn = this._createButton('edit', 'ticket-service__update-ticket-btn');

    // Кнопка "Удалить"
    const deleteTicketBtn = this._createButton('delete', 'ticket-service__delete-ticket-btn');

    // Добавляем кнопки в контейнер
    btnContainer.append(updateTicketBtn, deleteTicketBtn);

    return btnContainer;
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
  _createButton(iconName = '', btnClassName = '', text = '') {
    const button = document.createElement('button');
    button.className = `ticket-service__ticket-btn ${btnClassName}`;
    button.textContent = text;

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
