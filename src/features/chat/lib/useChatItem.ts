import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/providers/StoreProvider/store";
import { getChatById } from "../api/getChatById";
import { setChatMessages, setCurrentModel } from "../model/chatSlice";
import { getModelList } from "../api/getModelList";
import { options } from "../../../shared/consts/select-options";
import { changeModel } from "../api/changeModel";

export const useChatItem = () => {
  const id = useSelector((state: RootState) => state.chat.selectedChatId);
  const currentModel = useSelector((state: RootState) => state.chat.currentModel);
  const messages = useSelector((state: RootState) => state.chat.chatMessages.data);
  const dispatch = useDispatch();
  const [selectedModel, setSelectedModel] = useState(options[0]);

  useEffect(() => {
    if (id) {
      getChatById(id).then(chat => {
        if (chat) dispatch(setChatMessages(chat));
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    getModelList().then(response => console.log(response));
  }, []);

  useEffect(() => {
    const foundOption = options.find(option => option.value === currentModel);
    if (foundOption) {
      setSelectedModel(foundOption);
    }
  }, [currentModel]);

  const handleChangeModel = async (selectedOption: { value: string; label: string }) => {
    setSelectedModel(selectedOption);
    dispatch(setCurrentModel(selectedOption.value));
    if (id) await changeModel({ id, modelId: selectedOption.value });
  };

  return { id, messages, selectedModel, handleChangeModel };
};
