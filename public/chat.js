function createChat(socket) {
    const form = createDiv();
    const headerDiv = createDiv();
    const messageDiv = createDiv();
    const inputDiv = createDiv();

    headerDiv.parent(form);
    inputDiv.parent(form);
    messageDiv.parent(form);

    const header = createElement('h3', 'Chat');
    const input = createInput();
    const sendButton = createButton('✉️');

    createElement('br').parent(headerDiv);
    createElement('hr').parent(headerDiv);
    header.parent(headerDiv);
    input.parent(inputDiv);
    sendButton.parent(inputDiv);

    sendButton.mousePressed(sendMessage = () => {
        socket.emit('message', input.value());
        input.value('');
    });

    input.changed(sendMessage);

    socket.on('message', ({text, name}) => {
        const messageP = createP(`${name}: ${text}`);
        messageP.parent(messageDiv);
    });
}