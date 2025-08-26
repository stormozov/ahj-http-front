import createRequest from '../api/createRequest';
import Ticket from './Ticket';

/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    this._URL = 'http://localhost:7070';
    this._methodParam = '?method';
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

  get(id, callback) {}

  create(data, callback) {}

  update(id, data, callback) {}

  delete(id, callback) {}
}
