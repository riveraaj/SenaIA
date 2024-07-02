import ChatManager from './logic/chatManager.js';

//Initialize chat manager
const chatManager = new ChatManager();

//Event listeners for user interactions
document.addEventListener('click', e => {
   chatManager.handleUserInteraction(e);
});

document.addEventListener('keypress', e => {
   if (e.key === 'Enter') chatManager.handleUserInteraction(e);
});