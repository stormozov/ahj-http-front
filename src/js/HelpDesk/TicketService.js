import createRequest from '../api/createRequest';
import Ticket from './Ticket';

/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor(errorCallback) {
    this._URL = 'http://localhost:7070';
    this._methodParam = '?method';
    this._errorCallback = errorCallback;
  }

  /**
   * Получает URL
   */
  get URL() {
    return this._URL;
  }

  /**
   * Устанавливает URL
   * @param {string} value - URL, необходимый для отправки запросов
   */
  set URL(value) {
    this._URL = value;
  }

  list(callback) {
    const requestParams = {
      url: `${this.URL}/${this._methodParam}=allTickets`,
    };

    createRequest(requestParams)
      .then((response) => response.map((ticket) => new Ticket(ticket)))
      .then(callback);
  }

  /**
   * Получает информацию о тикете по ID
   * @param {string} id - ID тикета
   * @param {Function} callback - функция обратного вызова
   */
  get(id, callback) {
    const requestParams = {
      url: `${this.URL}/${this._methodParam}=ticketById&id=${id}`,
    };

    createRequest(requestParams)
      .then((response) => new Ticket(response))
      .then(callback)
      .catch((error) => {
        if (this._errorCallback) {
          this._errorCallback(`Ошибка при получении тикета: ${error.message}`);
        }
        callback(null);
      });
  }

  /**
   * Создает новый тикет
   * @param {Object} data - данные тикета
   * @param {Function} callback - функция обратного вызова
   */
  create(data, callback) {
    const requestParams = {
      url: `${this.URL}/${this._methodParam}=createTicket`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    createRequest(requestParams)
      .then((response) => {
        if (response && response.id) {
          const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
          tickets.push(new Ticket(response));

          localStorage.setItem('tickets', JSON.stringify(tickets));
          callback(response);
        } else {
          throw new Error('Failed to create ticket');
        }
      })
      .catch((error) => {
        if (this._errorCallback) {
          this._errorCallback(`Ошибка при создании тикета: ${error.message}`);
        }
        callback(null);
      });
  }

  /**
   * Обновляет существующий тикет
   *
   * @param {string} id - ID тикета
   * @param {Object} data - данные для обновления
   * @param {Function} callback - функция обратного вызова
   */
  update(id, data, callback) {
    const requestParams = {
      url: `${this.URL}/${this._methodParam}=updateById&id=${id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    createRequest(requestParams)
      .then((response) => {
        // Сервер возвращает массив тикетов при успешном обновлении
        if (response && Array.isArray(response)) {
          const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
          const index = tickets.findIndex((ticket) => ticket.id === id);
          if (index !== -1) {
            const updatedTicket = response.find((ticket) => ticket.id === id);
            if (updatedTicket) {
              tickets[index] = new Ticket(updatedTicket);
              localStorage.setItem('tickets', JSON.stringify(tickets));
            }
          }
          callback({ success: true });
        } else {
          throw new Error('Failed to update ticket');
        }
      })
      .catch((error) => {
        if (this._errorCallback) {
          this._errorCallback(`Ошибка при обновлении тикета: ${error.message}`);
        }
        callback(null);
      });
  }

  /**
   * Удаляет тикет
   * @param {string} id - ID тикета
   * @param {Function} callback - функция обратного вызова
   */
  delete(id, callback) {
    const requestParams = {
      url: `${this.URL}/${this._methodParam}=deleteById&id=${id}`,
      method: 'POST',
    };

    createRequest(requestParams)
      .then((response) => {
        // Сервер возвращает массив тикетов при успешном удалении
        if (response && Array.isArray(response)) {
          const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
          const updatedTickets = tickets.filter((ticket) => ticket.id !== id);

          localStorage.setItem('tickets', JSON.stringify(updatedTickets));
          callback({ success: true });
        } else {
          throw new Error('Failed to delete ticket');
        }
      })
      .catch((error) => {
        if (this._errorCallback) {
          this._errorCallback(`Ошибка при удалении тикета: ${error.message}`);
        }
        callback(null);
      });
  }
}
