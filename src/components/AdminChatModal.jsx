import { useEffect, useState } from 'react';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { url } from "../api/configuration";

const ChatModal = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cookies] = useCookies();
  const [input, setInput] = useState('');


    const refreshUsers = () => {
    fetch(`${url}/messages/users-with-messages`, {
      headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
      setUsers(data || []);
      if (data.length > 0) setActiveUserId(data[0].id);
      })
      .catch((err) => {
      console.error('Failed to fetch users:', err);
      setUsers([]);
      });
    };

    useEffect(refreshUsers, []);

    const fetchMessages = (page = 1, isFirstPage = true) => {
      const token = cookies.token;
      if (!token || token === 'undefined' || token.trim() === '' || !activeUserId) {
        return;
      }

      fetch(`${url}/messages/${activeUserId}?page=${page}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (isFirstPage) {
            setMessages(data.data);
          } else {
            setMessages(prev => [...data.data.reverse(), ...prev]);
          }
          setHasMore(data.current_page < data.last_page);
        })
        .catch(err => {
          console.error('Failed to fetch messages:', err);
        });
    };

    useEffect(() => {
      fetchMessages(1, true);
    }, [activeUserId, cookies.token]);

    const sendMessage = async () => {
      if (!input.trim()) return;

      try {
        const res = await fetch(`${url}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            receiver_id: activeUserId,
            body: input,
          }),
        });

        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setInput('');
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    };

  return (
    <div className="fixed bottom-[25px] right-[90px] z-50 w-[700px] h-[450px] bg-white shadow-lg rounded-lg flex overflow-hidden">
      <div className="w-[35%] border-r bg-gray-50">
        <div className="flex justify-between items-center p-4 bg-themegreen text-white">
          <h2 className="text-md font-semibold">Chats</h2>
          
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setActiveUserId(user.id)}
              className={`p-4 border-b cursor-pointer 0 ${
                activeUserId === user.id ? 'bg-white' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-2xl text-gray-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className="text-xs text-gray-500 w-[180px]">{user.body || 'No messages yet'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[70%] flex flex-col">
        <div className="p-2 bg-gray-200 border-b flex items-center gap-3">
          <FaUserCircle className="text-2xl text-gray-500" />
          <div>
            <p className="font-semibold">
              {users.find((u) => u.id === activeUserId)?.username || 'Select a user'}
            </p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
          <FaTimes onClick={onClose} className="ml-auto cursor-pointer hover:text-themered" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, index) =>
            msg.sender_id === activeUserId ? (
              <div key={index} className="flex items-start gap-2">
                <FaUserCircle className="text-xl text-gray-500" />
                <div className="bg-white border border-gray-200 p-2 rounded-md shadow-sm max-w-[75%] text-sm">
                  {msg.body}
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-end">
                <div className="bg-themegreen text-white p-2 rounded-md shadow-sm max-w-[75%] text-sm">
                  {msg.body}
                </div>
              </div>
            )
          )}
        </div>

        {hasMore && (
          <div className="text-center bg-gray-50">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchMessages(nextPage);
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              Load earlier messages
            </button>
          </div>
        )}
        
        {page > 1 && (
          <div className="text-center bg-gray-50">
            <button
              onClick={() => {
                const prevPage = page - 1;
                setPage(prevPage);
                fetchMessages(prevPage, true);
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              Previous messages
            </button>
          </div>
        )}

        <div className="p-3 border-t bg-white flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-themegreen"
          />
          <button
            onClick={sendMessage}
            className="bg-themegreen text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;