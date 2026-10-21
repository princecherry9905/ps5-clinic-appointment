function Message({ type, text }) {
    if (!text) {
        return null;
    }
    return <p className={"message message-" + type}>{text}</p>;
}

export default Message;
