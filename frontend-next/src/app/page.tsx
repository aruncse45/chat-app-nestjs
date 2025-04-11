'use client'
import React, { useState, useEffect, useRef } from 'react';
import io, {Socket} from 'socket.io-client';

interface User {
  id: string;
  username: string;
}

interface Message {
  type: 'public' | 'private' | 'notification';
  userId?: string;
  username?: string;
  message: string;
}

const ChatApp = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [publicMessage, setPublicMessage] = useState<Message[]>([]);
  const [privateMessage, setPrivateMessage] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3002', {
      transports: ['websocket']
    });

    setSocket(newSocket);
    console.log({newSocket})
    newSocket.on('connect', () => {
      setUserId(newSocket.id);
    });

    // User list management
    newSocket.on('user-list', (userList: User[]) => {
      setUsers(userList.filter(user => user.id !== newSocket.id));
    });

    // Username change handling
    newSocket.on('username-changed', (data) => {
      setUsers(prevUsers => prevUsers.map(user =>
          user.id === data.userId
              ? { ...user, username: data.newUsername }
              : user
      ));

      setPublicMessage(prevMessages => [...prevMessages, {
        type: 'notification',
        message: `${data.oldUsername} is now known as ${data.newUsername}`
      }]);
    });

    // User join/leave notifications
    newSocket.on('user-joined', (data) => {
      setUsers(prevUsers => {
        // Avoid duplicates
        const exists = prevUsers.some(user => user.id === data.userId);
        return exists
            ? prevUsers
            : [...prevUsers, { id: data.userId, username: data.username }];
      });

      setPublicMessage(prevMessages => [...prevMessages, {
        type: 'notification',
        message: data.message
      }]);
    });

    newSocket.on('user-left', (data) => {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== data.userId));

      setPublicMessage(prevMessages => [...prevMessages, {
        type: 'notification',
        message: data.message
      }]);
    });

    // Public message handling
    newSocket.on('public-message', (data) => {
      console.log({data})
      setPublicMessage(prevMessages => [...prevMessages, {
        type: 'public',
        userId: data.userId,
        username: data.username,
        message: data.message
      }]);
    });

    // Private message handling
    newSocket.on('private-message', (data) => {
      console.log('Private: ',{data})
      setPrivateMessage(prevMessages => [...prevMessages, {
        type: 'private',
        userId: data.userId,
        username: data.username,
        message: data.message
      }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Scroll to bottom when publicMessage change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [publicMessage, privateMessage]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !socket) return;

    if (selectedUser) {
      // Send private message
      socket.emit('private-message', {
        recipientId: selectedUser.id,
        message: inputMessage
      });
    } else {
      // Send public message
      socket.emit('public-message', inputMessage);
    }

    // Clear input after sending
    setInputMessage('');
  };

  const changeUsername = () => {
    if (socket && username.trim()) {
      socket.emit('set-username', username);
    }
  };
  console.log({privateMessage})
  return (
      <div className="max-w-4xl mx-auto my-8 p-4 border rounded-lg shadow-lg flex">
        {/* User List */}
        <div className="w-1/4 border-r pr-4">
          <h2 className="font-bold mb-4">Online Users</h2>
          <div className="mb-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter username"
            />
            <button
                onClick={changeUsername}
                className="w-full mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Set Username
            </button>
          </div>
          {users.map(user => (
              <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedUser?.id === user.id ? 'bg-blue-100' : ''
                  }`}
              >
                {user.username}
                {selectedUser?.id === user.id && (
                    <span className="text-xs text-blue-500 ml-2">(Selected)</span>
                )}
              </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="w-3/4 pl-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {selectedUser
                  ? `Private Chat with ${selectedUser.username}`
                  : 'Public Chat'}
            </h1>
            {selectedUser && (
                <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sm text-blue-500"
                >
                  Back to Public Chat
                </button>
            )}
          </div>

          {!selectedUser && (<div className="h-64 overflow-y-auto border mb-4 p-2">
            {publicMessage
                .map((message, index) => (
                    <div
                        key={index}
                    >
                      {message.type !== 'notification' &&
                          <span className="font-bold mr-2">
                    {message.username || 'Anonymous'}:
                  </span>}
                      {message.message}
                    </div>
                ))
            }
          </div>
          )}
          {selectedUser && (<div className="h-64 overflow-y-auto border mb-4 p-2">
                {privateMessage
                    .map((message, index) => (
                        <div
                            key={index}
                        >
                              <span className="font-bold mr-2">
                    {message.username || 'Anonymous'}:
                  </span>
                          {message.message}
                        </div>
                    ))
                }
              </div>
          )}

          <form onSubmit={sendMessage} className="flex">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow p-2 border rounded-l-lg"
                placeholder={
                  selectedUser
                      ? `Send private message to ${selectedUser.username}`
                      : 'Type your message...'
                }
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
            >
              {selectedUser ? 'Send Private' : 'Send Public'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default ChatApp;