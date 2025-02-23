import { useState } from "react";
import styles from './chat-item.module.css'
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setChatMessages } from "../model/chatSlice";
import { RootState } from "../../../app/providers/StoreProvider/store";
import { sendMessageApi } from "../api/sendMessage";
import { startEventStream } from "../../../shared/api/stream";
import { getChatById } from "../api/getChatById";

interface ChatInputProps {
  chatId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ chatId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.chatMessages.data);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      if (chatId) {
        const response = await getChatById(chatId);
        if (response) {
          dispatch(setChatMessages(response));
        }
      }
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessageApi({ chatId, message: newMessage });

        const date = new Date().toISOString();
        const tempId = `temp_${Date.now()}`;
        dispatch(addMessage({ content: newMessage, role: "user", created_at: date, id: tempId }));
        setNewMessage("");

        startEventStream({
          url: `https://bothubq.com/api/v2/chat/${chatId}/stream`,
          onMessage: (updatedChat) => {
            console.log("updatedChat", updatedChat);
            if (updatedChat.name === "MESSAGE_UPDATE" && updatedChat.data.message.role) {
              if (!messages.some((msg) => msg.id === updatedChat.data.message.id)) {
                fetchMessages();
              }
            }
          },
          onError: (error) => {
            console.error("Ошибка при обработке потока:", error);
          },
        });
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    }
  };

  return (
    <div className={styles["add-message-div"]}>
      <input
        className={styles["add-message"]}
        placeholder="Спроси о чём-нибудь..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
     <div className={styles["add-message-button"]} onClick={sendMessage}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="38" rx="8" fill="#1C64F2" />
              <path
                d="M26.9161 13.1004C27.3086 12.1502 26.2564 11.2295 25.1705 11.5737L11.8994 15.7736C10.8099 16.1187 10.6782 17.4195 11.6804 17.9276L15.9166 20.0737L19.6994 16.7636L17.2015 21.198L19.6549 24.9049C20.2346 25.7819 21.7212 25.6658 22.1156 24.7133L26.9161 13.1004Z"
                fill="white"
              />
            </svg>
          </div>
    </div>
  );
};
