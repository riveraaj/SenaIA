import { sendMessageToOpenAI } from '../connection/openIA.js';
import { updateElapsedTime } from '../helper/dateHelper.js';

/**
 * Class responsible for managing chat interactions and updating the UI.
 */
export default class ChatManager {
    constructor() {
        this.firstMessage = false; //Flag to track if it's the first user message
        this.$btnSubmit = document.getElementById('search-sender'); //Button for submitting user input
        this.$input = document.querySelector('.serch-container input[type="search"]'); //Input field for user messages
        this.$suggestionPhase = document.querySelector('.suggestion-phase'); //Phase for suggestion items
        this.$templateSystem = document.getElementById('template-system').content; //Template for system messages
        this.$templateUser = document.getElementById('template-user').content; //Template for user messages
        this.$header = document.querySelector('header'); //Header element
        this.$main = document.querySelector('main'); //Main content area
        this.$chatContainer = document.querySelector('.chat-container'); //Container for chat messages

        setInterval(updateElapsedTime, 30000);
    }

    /**
     * Initializes the chat interface by hiding initial elements and displaying the chat container.
     */
    initializeChat() {
        this.$main.classList.remove('is-start');
        this.$header.classList.remove('is-start');
        this.$suggestionPhase.style.display = 'none';
        this.$chatContainer.style.display = 'flex';
    }

    /**
     * Handles sending a system message to OpenAI based on user input.
     * @param {string} text - User input message.
     */
    async handleSystemChat(text) {
        let message = '';
        if (!text.trim()) {
            message = '¡Hola! Parece que tu mensaje está vacío. ¿Hay algo en lo que pueda ayudarte hoy?';
            this.addMessageToChat(message, 'system'); //Add system response to the chat
            return;
        }
        try {
            //Send user message to OpenAI and get response
            // message = await sendMessageToOpenAI({
            //     message: text,
            //     maxTokens: 150,
            //     temperature: 0.7
            // });

            //Replace newline characters (\n) with <br> tags for HTML display
            message = message.replace(/\n/g, '<br>');

            //Replace **text** with <strong>text</strong> for bold formatting
            message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            this.addMessageToChat(message, 'system'); //Add system response to the chat
        } catch (error) {
            console.error('Error fetching response:', error);
            this.addMessageToChat('¡Ops! Algo salió mal. Por favor, inténtalo de nuevo más tarde.', 'system');
        }
    }

    /**
     * Adds a message to the chat interface.
     * @param {string} message - Message content to add.
     * @param {string} role - Role of the message ('system' or 'user').
     */
    addMessageToChat(message, role) {
        const $template = role === 'system' ? this.$templateSystem : this.$templateUser;
        const $clone = document.importNode($template, true);

        (role === 'system') ? $clone.querySelector('div').innerHTML = message: $clone.querySelector('div').textContent = message;

        const timestamp = new Date();
        $clone.querySelector('footer').setAttribute('data-timestamp', timestamp);

        this.$chatContainer.appendChild($clone);
        updateElapsedTime();
        this.scrollToBottom();
    }

    /**
     * Scrolls the chat container to the bottom.
     */
    scrollToBottom() {
        this.$chatContainer.scrollTop = this.$chatContainer.scrollHeight;
    }

    /**
     * Handles user input and interaction with the chat.
     * @param {Event} event - Event object from user interaction.
     */
    async handleUserInteraction(event) {
        const target = event.target;
        if (target === this.$btnSubmit || target.parentElement === this.$btnSubmit || event.key === 'Enter') await this.handleChatAndMessage(this.$input.value);
        if (target.classList.contains('suggestion-phase_item')) await this.handleChatAndMessage(target.textContent);
    }

    /**
     * Handles processing of user input message and sending it to OpenAI.
     * @param {string} text - User input message.
     */
    async handleChatAndMessage(text) {
        //Initialize the chat interface if it's the first user message
        if (!this.firstMessage) {
            this.initializeChat();
            this.firstMessage = true;
        }

        this.handleUserChat(text); //Add user message to the chat
        this.$input.value = ''; //Clear the input field after processing
        await this.handleSystemChat(text); //Send user message to OpenAI and add system response
    }

    /**
     * Adds a user message to the chat interface.
     * @param {string} text - User input message.
     */
    handleUserChat(text) {
        this.addMessageToChat(text.trim(), 'user');
    }
}