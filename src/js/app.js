import HelpDesk from './HelpDesk/HelpDesk';
import TicketService from './HelpDesk/TicketService';

const ticketList = document.querySelector('.ticket-service__ticket-list');

const ticketService = new TicketService();
const app = new HelpDesk(ticketList, ticketService);

app.init();
