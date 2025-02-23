import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chat-item.module.css";
import { getChatById } from "../api/getChatById";
import {setChatMessages, setCurrentModel } from "../model/chatSlice";
import { RootState } from "../../../app/providers/StoreProvider/store";
import Select, { SingleValue } from 'react-select'
import { getModelList } from "../api/getModelList";
import { changeModel } from "../api/changeModel";
import {options} from '../../../shared/consts/select-options'
import { customStyles } from "../../../shared/ui/select-styles";
import { ChatMessages } from "./chatMessages";
import { ChatInput } from "./chatInput";
export const ChatItem: React.FC = () => {
    const id = useSelector((state: RootState) => state.chat.selectedChatId);
    const currentModel = useSelector((state: RootState) => state.chat.currentModel)
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.chatMessages.data);
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
        <ChatMessages messages={messages} />
      )}
  
  {id && (
      <div className={styles["chat-footer"]}> 
      <div className={styles["select-wrapper"]}>
      <Select options={options} styles={customStyles} value={selectedModel} onChange={handleChangeModel}/>
      </div>
       <ChatInput chatId={id} />

      </div>
    )}
  </div>
);
  
};
