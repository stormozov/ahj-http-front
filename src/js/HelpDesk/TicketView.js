import { formatDate } from '../utils/dataUtils';

/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(container) {
    this.container = container;
  }

  render(tickets) {
    tickets.forEach((ticket) => {
      const ticketItem = this._createTicketItem(ticket);
      console.log(ticketItem);

      this.container.append(ticketItem);
    });
  }

  /**
   * Создает разметку для одного тикета
   * @param {Ticket} ticket - объект с информацией о тикете
   * @return {HTMLElement} HTML-элемент тикета
   */
  _createTicketItem(ticket) {
    const ticketItem = document.createElement('li');
    ticketItem.className = 'ticket-service__ticket-item';

    const ticketStatus = document.createElement('input');
    ticketStatus.className = 'ticket-service__ticket-status';
    ticketStatus.id = ticket.id;
    ticketStatus.type = 'checkbox';
    ticketStatus.checked = ticket.status;

    const ticketInfo = this._createTicketInfo(ticket);
    const ticketBtns = this._createTicketBtns();

    ticketItem.append(ticketStatus, ticketInfo, ticketBtns);

    return ticketItem;
  }

  /**
   * Создает разметку для информации о тикете
   * @param {Ticket} ticket - объект с информацией о тикете
   * @return {HTMLElement} HTML-элемент информации о тикете
   */
  _createTicketInfo(ticket) {
    const ticketInfo = document.createElement('div');
    ticketInfo.className = 'ticket-service__ticket-info';

    const ticketName = document.createElement('p');
    ticketName.className = 'ticket-service__ticket-name';
    ticketName.textContent = ticket.name;

    const ticketCreatedAt = document.createElement('time');
    ticketCreatedAt.className = 'ticket-service__ticket-created';
    ticketCreatedAt.textContent = formatDate(ticket.created);

    ticketInfo.append(ticketName, ticketCreatedAt);

    return ticketInfo;
  }

  /**
   * Создает разметку для кнопок управления тикетом
   * @return {HTMLElement} HTML-элемент кнопок управления тикетом
   */
  _createTicketBtns() {
    const btnContainer = document.createElement('div');
    btnContainer.className = 'ticket-service__ticket-actions';

    const updateTicketBtn = document.createElement('button');
    updateTicketBtn.className = 'ticket-service__update-ticket-btn';
    updateTicketBtn.textContent = '✍';
    updateTicketBtn.title = 'Редактировать';

    const deleteTicketBtn = document.createElement('button');
    deleteTicketBtn.className = 'ticket-service__delete-ticket-btn';
    deleteTicketBtn.textContent = '❌';
    deleteTicketBtn.title = 'Удалить';

    btnContainer.append(updateTicketBtn, deleteTicketBtn);

    return btnContainer;
  }
}
