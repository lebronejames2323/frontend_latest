import { useState, useEffect } from 'react';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { url } from "../api/configuration";

const ChatModal = ({ onClose }) => {
    const receiverId = 1;
    const [cookies] = useCookies();
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [input, setInput] = useState('');

    const fetchMessages = async (pageToLoad = 1, isFirstPage = true) => {
        try {
            const res = await fetch(`${url}/messages/${receiverId}?page=${pageToLoad}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${cookies.token}`,
            },
            });

            const data = await res.json();

            if (data && data.data) {
            if (isFirstPage) {
                setMessages(data.data);
            } else {
                setMessages(prev => [...data.data.reverse(), ...prev]);
            }

            setHasMore(data.current_page < data.last_page);
            } else {
            console.error('Unexpected response:', data);
            setMessages([]);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        }
    };

    useEffect(() => {
        fetchMessages(1, true);
        setPage(1);
    }, [receiverId, cookies.token]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const res = await fetch(`${url}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
            receiver_id: receiverId,
            body: input,
        }),
        });

        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setInput('');
    };

  return (
    <div className="fixed bottom-[25px] right-[90px] z-50 w-[350px] h-[430px] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-themegreen text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Customer Service</h2>
            <FaTimes onClick={onClose} className="cursor-pointer hover:text-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender_id === receiverId ? 'items-start gap-2' : 'justify-end'}`}>
                {msg.sender_id === receiverId ? (
                <>
                    <FaUserCircle className="text-2xl text-gray-500" />
                    <div className="bg-white border border-gray-200 p-2 rounded-md shadow-sm max-w-[75%]">
                    <p className="text-sm text-gray-800">{msg.body}</p>
                    </div>
                </>
                ) : (
                <div className="bg-themegreen text-white p-2 rounded-md shadow-sm max-w-[75%]">
                    <p className="text-sm">{msg.body}</p>
                </div>
                )}
            </div>
            ))}
        </div>

        {hasMore && (
        <div className="text-center bg-gray-50">
            <button
            onClick={() => {
                const nextPage = page + 1;
                fetchMessages(nextPage);
                setPage(nextPage);
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
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-themegreen"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
            onClick={sendMessage}
            className="bg-themegreen text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
            Send
            </button>
        </div>
    </div>
  );
};

export default ChatModal;