const ChatConversation = ({ messages, thinking = false }) => {
  return (
    <div style={styles.container}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            ...styles.row,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <div
            style={{
              ...styles.bubble,
              ...(msg.role === 'user'
                ? styles.userBubble
                : styles.gptBubble)
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {thinking && (
        <div style={{ ...styles.row, justifyContent: 'flex-start' }}>
          <div style={{ ...styles.bubble, ...styles.gptBubble }}>
            <span style={styles.spinner} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px'
  },
  row: {
    display: 'flex'
  },
  bubble: {
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: 1.4
  },
  userBubble: {
    backgroundColor: '#007aff',
    color: '#fff',
    borderBottomRightRadius: '4px'
  },
  gptBubble: {
    backgroundColor: '#f1f1f1',
    color: '#000',
    borderBottomLeftRadius: '4px'
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid #ccc',
    borderTop: '2px solid #666',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  }
};

export default ChatConversation;
