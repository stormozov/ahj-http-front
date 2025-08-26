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
  }

  init() {
    console.info('init');

    this.renderTickets();
  }

  renderTickets() {
    this.ticketService.list((response) => {
      this.ticketView.render(response);
    });
  }
}
