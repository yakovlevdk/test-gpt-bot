import { useEffect } from 'react';
import { ChatItem } from "./ui/chat-item";
import { SideBar } from "./ui/sidebar";
import styles from './chats.module.css';
import { getChatList } from "./api/getChatList";
import { useDispatch } from 'react-redux';
import { setChatList } from './model/chatSlice';

export const Chat = () => { 
    const dispatch = useDispatch()
    useEffect(() => {
        const getChats = async () => { 
            try {
                const chatList = await getChatList();
                console.log(chatList);
                if(chatList) { 
                    dispatch(setChatList(chatList))
                }
            } catch (error) {
                console.error("Ошибка при получении списка чатов:", error);
            }
        };
        getChats();
    }, []);

    return ( 
        <div className={styles.chats}>
            <SideBar/>
            <ChatItem />
        </div>
    );
};
