import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Inbox.css';
import { API_BASE_URL } from './config';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  receiverId: number;
  receiverName: string;
  receiverEmail: string;
  readStatus: 'SENT' | 'READ';
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
}

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Fetch current user's ID
  const fetchMyId = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/myId`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      
      if (response.ok) {
        const id = await response.json();
        setMyId(id);
        console.log('Current user ID:', id);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Initial fetch of user ID
  useEffect(() => {
    if (token) {
      fetchMyId();
    }
  }, [token]);

  // Check if we arrived from another user's profile
  useEffect(() => {
    if (location.state && location.state.recipient) {
      const recipient = location.state.recipient;
      // Handle case where the API returns id instead of userId
      if (recipient.id && !recipient.userId) {
        recipient.userId = recipient.id;
      }
      console.log('Setting selected contact from navigation:', recipient);
      setSelectedContact(recipient);
    }
  }, [location.state]);

  // Scroll to bottom of message list when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, selectedContact]);

  // Fetch messages and contacts
  const fetchMessages = async () => {
    try {
      // Fetch sent messages
      const sentResponse = await fetch(`${API_BASE_URL}/getSentMessages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch received messages
      const receivedResponse = await fetch(`${API_BASE_URL}/getReceivedMessages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check for unauthorized responses
      if (sentResponse.status === 401 || receivedResponse.status === 401) {
        handleUnauthorized();
        return;
      }
      
      if (sentResponse.ok && receivedResponse.ok) {
        const sentData = await sentResponse.json();
        const receivedData = await receivedResponse.json();
        
        console.log('Fetched sent messages:', sentData);
        console.log('Fetched received messages:', receivedData);
        
        // Combine sent and received messages
        const allMessages = [...sentData, ...receivedData];
        console.log('Combined all messages:', allMessages);
        setMessages(allMessages);
        
        // Extract unique contacts from messages
        const uniqueContacts = new Map<number, User>();
        
        // Get current user ID from sent messages
        const myId = sentData.length > 0 ? sentData[0].senderId : null;
        console.log('Current user ID from messages:', myId);
        
        if (myId) {
          // Extract contacts from sent messages (recipients)
          sentData.forEach((message: Message) => {
            if (!uniqueContacts.has(message.receiverId) && message.receiverId !== myId) {
              uniqueContacts.set(message.receiverId, {
                userId: message.receiverId,
                name: message.receiverName,
                email: message.receiverEmail
              });
            }
          });
          
          // Extract contacts from received messages (senders)
          receivedData.forEach((message: Message) => {
            if (!uniqueContacts.has(message.senderId) && message.senderId !== myId) {
              uniqueContacts.set(message.senderId, {
                userId: message.senderId,
                name: message.senderName,
                email: message.senderEmail
              });
            }
          });
          
          const contactsArray = Array.from(uniqueContacts.values());
          console.log('Updated contacts:', contactsArray);
          setContacts(contactsArray);
        }
      } else {
        console.error('Failed to fetch messages:', {
          sentStatus: sentResponse.status,
          receivedStatus: receivedResponse.status
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle unauthorized responses
  const handleUnauthorized = () => {
    // Clear token and userId from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Redirect to login page
    navigate('/login');
  };

  // Initial fetch
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchMessages();
    }
  }, [token]);

  // Set up periodic refresh for new messages (every 10 seconds)
  useEffect(() => {
    if (!token) return;
    
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [token]);

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;
    
    // Make sure we have a valid userId
    const receiverId = selectedContact.userId;
    
    if (!receiverId) {
      console.error("Cannot send message: receiverId is undefined");
      return;
    }
    
    console.log("Sending message to " + receiverId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/sendMesssage`, {
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
      
      // Check for unauthorized response
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      
      if (response.ok) {
        const sentMessage = await response.json();
        console.log('Message sent successfully:', sentMessage);
        
        // Add the new message to our messages state
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        
        // Immediately refresh messages to ensure we get the latest
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getConversation = (userId: number | undefined) => {
    if (!userId || !myId) return [];
    
    console.log('Getting conversation between', myId, 'and', userId);
    console.log('Available messages:', messages);
    
    const filteredMessages = messages.filter(
      msg => (msg.senderId === userId && msg.receiverId === myId) || 
             (msg.senderId === myId && msg.receiverId === userId)
    );
    
    console.log('Filtered messages for conversation:', filteredMessages);
    
    return filteredMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
              
              <div className="messages-list" ref={messageListRef}>
                {getConversation(selectedContact.userId).length === 0 ? (
                  <p className="no-messages">No messages yet. Send a message to start the conversation.</p>
                ) : (
                  getConversation(selectedContact.userId).map(message => {
                    const isMyMessage = message.senderId === myId;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`message-bubble ${isMyMessage ? 'my-message' : 'their-message'}`}
                        style={{ alignSelf: isMyMessage ? 'flex-end' : 'flex-start' }}
                      >
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMyMessage && (
                            <span className="message-status">
                              {message.readStatus === 'READ' ? ' (Read)' : ' (Sent)'}
                            </span>
                          )}
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