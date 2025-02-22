import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chat-item.module.css";
import { getChatById } from "../api/getChatById";
import { addMessage, setChatMessages, setCurrentModel } from "../model/chatSlice";
import { RootState } from "../../../app/providers/StoreProvider/store";
import { sendMessageApi } from "../api/sendMessage";
import Select, { SingleValue } from 'react-select'
import { getModelList } from "../api/getModelList";
import { changeModel } from "../api/changeModel";
import {options} from '../../../shared/consts/select-options'
import { customStyles } from "../../../shared/ui/select-styles";
import { startEventStream } from "../../../shared/api/stream";
export const ChatItem: React.FC = () => {
    const id = useSelector((state: RootState) => state.chat.selectedChatId);
    const currentModel = useSelector((state: RootState) => state.chat.currentModel)
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.chatMessages.data);
  const [newMessage, setNewMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(options[0]);
  const fetchMessages = async () => {
    try {
        if(id) { 
            const chat = await getChatById(id);
            if (chat) {
              dispatch(setChatMessages(chat));
            }
        }
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
    }
  };

  useEffect(() => {
    const foundOption = options.find(option => option.value === currentModel);
    if (foundOption) {
      setSelectedModel(foundOption);
    }
  }, [currentModel]);

  useEffect(() => {
    fetchMessages();
    const fetchModels = async () => { 
 const response = await getModelList()
 console.log(response)
 return response 
    }
    fetchModels()
  }, [id]);


  
  const sendMessage = async () => {
    if (newMessage.trim() ) {
      try {
        if (id) {
          await sendMessageApi({ chatId: id, message: newMessage });
        }
        const date = new Date().toISOString();
        const tempId = `temp_${Date.now()}`
          dispatch(addMessage({ content: newMessage, role: "user", created_at: date, id: tempId}));
        setNewMessage(""); 
        startEventStream({
          url: `https://bothubq.com/api/v2/chat/${id}/stream`,
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
      } finally {
console.log('finally');
      }
    }
  };
  


  const handleChangeModel = async (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (!selectedOption) return
    setSelectedModel(selectedOption);
    dispatch(setCurrentModel(selectedOption.value));
    if(id)  { 
      await changeModel({id, modelId: selectedOption.value})
    }
  };


  return (
    <div className={styles["chat-item"]}>
     
      {!id ? (
        <h2 className={styles["not-chat"]}>Выбери чат!</h2>
      ) : messages.length === 0 ? (
        <h2 className={styles["null-messages"]}>Сообщений пока нет.</h2>
      ) : (
        [...messages].reverse().map((message) => (
          <div
            key={message.id}
            className={message.role === "assistant" ? styles["message-assistant"] : styles["message-user"]}
          >
            {message.role === "assistant" ? (
              <div className={styles["message-assistant-content"]}>
                <div className={styles["assistant-icon"]}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#28A08C" />
                    <path
                      d="M31.5755 17.5804C31.8036 16.9036 31.92 16.1951 31.9201 15.4818C31.9201 14.3017 31.6015 13.1428 30.9971 12.1243C29.7827 10.0386 27.5299 8.75083 25.0917 8.75083C24.6115 8.75083 24.1324 8.80088 23.6628 8.90015C23.0311 8.19788 22.2556 7.6357 21.3876 7.25071C20.5196 6.86572 19.5787 6.66665 18.627 6.66663H18.5843L18.5683 6.66672C15.6152 6.66672 12.9964 8.54684 12.0886 11.3186C11.149 11.5085 10.2612 11.8942 9.48491 12.4501C8.70856 13.0059 8.06152 13.7189 7.58708 14.5415C6.98455 15.566 6.66703 16.7295 6.66666 17.914C6.66689 19.5788 7.29319 21.1842 8.4243 22.4196C8.19598 23.0962 8.07952 23.8049 8.07943 24.5181C8.07954 25.6982 8.39814 26.8572 9.0025 27.8756C9.72119 29.1102 10.8187 30.0878 12.1368 30.6673C13.4549 31.2466 14.9255 31.3981 16.3365 31.0997C16.9683 31.802 17.7438 32.3641 18.6119 32.7492C19.4799 33.1341 20.4208 33.3333 21.3725 33.3333H21.4153L21.4327 33.3332C24.3873 33.3332 27.0052 31.453 27.9131 28.6788C28.8527 28.4888 29.7404 28.103 30.5168 27.5472C31.2931 26.9913 31.9403 26.2782 32.4147 25.4558C33.0165 24.4321 33.3335 23.2696 33.3333 22.0861C33.3331 20.4214 32.7065 18.8156 31.5755 17.5804Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className={styles["message-text"]}>
                  <div className={styles["title-bot-mes"]}>
                    <span>ChatGPT</span>
                    <div className={styles["model-chat"]}>
                      <span>{message.model_id}</span>
                    </div>
                  </div>
                  <span className={styles["message-content-text"]}>{message.content}</span>
                  
                  <span className={styles["message-content-data"]}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles["message-user-user"]}>
                <div className={styles["message-user-content"]}>
                  <div className={styles["message-text"]}>
                    <span className={styles["message-content-text"]}>{message.content}</span>
                    <span className={styles["message-content-data"]}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <div className={styles["message-user-icon"]}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1_22029)">
                      <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="#313E62"/>
                      <path d="M20 21.4062C21.6783 21.4062 23.2879 20.7395 24.4747 19.5528C25.6614 18.366 26.3281 16.7564 26.3281 15.0781C26.3281 13.3998 25.6614 11.7902 24.4747 10.6035C23.2879 9.41671 21.6783 8.75 20 8.75C18.3217 8.75 16.7121 9.41671 15.5253 10.6035C14.3386 11.7902 13.6719 13.3998 13.6719 15.0781C13.6719 16.7564 14.3386 18.366 15.5253 19.5528C16.7121 20.7395 18.3217 21.4062 20 21.4062ZM15.8384 22.8125C11.9229 22.8125 8.75 25.9853 8.75 29.9009C8.75 30.6479 9.35645 31.25 10.0991 31.25H29.9009C30.6479 31.25 31.25 30.6436 31.25 29.9009C31.25 25.9853 28.0772 22.8125 24.1616 22.8125H15.8384Z" fill="white"/>
                    </g>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))
      )}
  
  {id && (
      <div className={styles["chat-footer"]}>
      <div className={styles["select-wrapper"]}>
          <Select options={options} styles={customStyles} value={selectedModel} onChange={handleChangeModel}/>
        </div>
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
      </div>
    )}
  </div>
);
  
};
