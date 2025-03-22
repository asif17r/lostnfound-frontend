import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Inbox.css';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  readStatus: 'SENT' | 'READ';
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  id?: number; // Some APIs might return id instead of userId
}

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we arrived from another user's profile
  useEffect(() => {
    if (location.state && location.state.recipient) {
      const recipient = location.state.recipient;
      // Handle case where the API returns id instead of userId
      if (recipient.id && !recipient.userId) {
        recipient.userId = recipient.id;
      }
      console.log("Setting recipient from location state:", recipient);
      setSelectedContact(recipient);
    }
  }, [location.state]);

  // Fetch messages and contacts
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // In a real app, you would have an API endpoint that returns all messages
        const response = await fetch('http://localhost:8080/getMessages', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          
          // Extract unique contacts from messages
          const uniqueContacts = new Map<number, User>();
          
          data.forEach((message: Message) => {
            if (!uniqueContacts.has(message.senderId) && message.senderId !== Number(localStorage.getItem('userId'))) {
              fetch(`http://localhost:8080/profile/${message.senderId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
                .then(res => res.json())
                .then(userData => {
                  // Ensure we have userId even if API returns id
                  const user = userData.user;
                  if (user.id && !user.userId) {
                    user.userId = user.id;
                  }
                  uniqueContacts.set(message.senderId, user);
                  setContacts(Array.from(uniqueContacts.values()));
                });
            }
            
            if (!uniqueContacts.has(message.receiverId) && message.receiverId !== Number(localStorage.getItem('userId'))) {
              fetch(`http://localhost:8080/profile/${message.receiverId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
                .then(res => res.json())
                .then(userData => {
                  // Ensure we have userId even if API returns id
                  const user = userData.user;
                  if (user.id && !user.userId) {
                    user.userId = user.id;
                  }
                  uniqueContacts.set(message.receiverId, user);
                  setContacts(Array.from(uniqueContacts.values()));
                });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMessages();
    }
  }, [token]);

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;
    
    // Make sure we have a valid userId
    const receiverId = selectedContact.userId || selectedContact.id;
    
    if (!receiverId) {
      console.error("Cannot send message: receiverId is undefined");
      return;
    }
    
    console.log("Sending message to " + receiverId);
    
    try {
      const response = await fetch('http://localhost:8080/sendMesssage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: receiverId,
          content: newMessage
        })
      });
      
      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch('http://localhost:8080/readMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageId)
      });
      
      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(prev => 
          prev.map(msg => msg.id === messageId ? updatedMessage : msg)
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getConversation = (userId: number) => {
    const myId = Number(localStorage.getItem('userId'));
    return messages.filter(
      msg => (msg.senderId === userId && msg.receiverId === myId) || 
             (msg.senderId === myId && msg.receiverId === userId)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="inbox-container">
      <div className="inbox-header">
        <h1>Inbox</h1>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
      
      <div className="inbox-content">
        <div className="contacts-list">
          <h2>Conversations</h2>
          {contacts.length === 0 ? (
            <p className="no-contacts">No conversations yet</p>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.userId} 
                className={`contact-item ${selectedContact?.userId === contact.userId ? 'selected' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p>{contact.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="message-area">
          {selectedContact ? (
            <>
              <div className="message-header">
                <h2>Conversation with {selectedContact.name}</h2>
              </div>
              
              <div className="messages-list">
                {getConversation(selectedContact.userId).length === 0 ? (
                  <p className="no-messages">No messages yet. Send a message to start the conversation.</p>
                ) : (
                  getConversation(selectedContact.userId).map(message => {
                    const isMyMessage = message.senderId === Number(localStorage.getItem('userId'));
                    
                    // Mark message as read if it's not mine and not read yet
                    if (!isMyMessage && message.readStatus === 'SENT') {
                      markAsRead(message.id);
                    }
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`message-bubble ${isMyMessage ? 'my-message' : 'their-message'}`}
                      >
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="message-input-area">
                <textarea 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="select-contact-prompt">
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox; 