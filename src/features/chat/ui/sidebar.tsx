import styles from './sidebar.module.css'
import logo from '../../../shared/logo.svg'
import addChat from '../../../shared/add-chat.svg'
import search from '../../../shared/search-simple.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/providers/StoreProvider/store'
import { useAuthActions } from '../../auth/lib/onSubmitAuthForm'
import {createChat} from '../api/createChat'
import { setChatList,  setCurrentModel,  setSelectedChatId } from '../model/chatSlice'
import { getChatList } from '../api/getChatList'
import { deleteChat } from '../api/deleteChat'
import { useState } from 'react'
import { changeName } from '../api/changeName'
export const SideBar = () => { 
const chats = useSelector((state: RootState) => state.chat.chatList.data)
const { onLogout } = useAuthActions()
    const email = useSelector((state: RootState) => state.user.email)
const dispatch = useDispatch()
const handleCreateChat = async() => {
   const response =  await createChat();
       const chatList = await getChatList();
                    if(chatList) { 
                        dispatch(setChatList(chatList))
                    }
   return response;
}
const [editingChatId, setEditingChatId] = useState<string | null>(null)
const [newChatName, setNewChatName] = useState<string>('')

const handleEditChat = (id: string, name: string) => {
    setEditingChatId(id)
    setNewChatName(name)
}

const handleChangeChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatName(e.target.value)
}

const handleUpdateChatName = async (id: string) => {
    if (newChatName.trim()) {
        console.log(newChatName);
        await changeName({id, name: newChatName})
        const chatList = await getChatList()
        if (chatList) dispatch(setChatList(chatList))
    }
    setEditingChatId(null)
}

const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
        await handleUpdateChatName(id)
    }
}


const handleDeleteChat = async (id: string) => { 
    const response = await deleteChat(id)
    const chatList = await getChatList();
    if(chatList) { 
        dispatch(setChatList(chatList))
    }
    return response
}
const setChat = ({id, model_id} : {id: string, model_id: string}) => { 
    dispatch(setSelectedChatId(id))
    dispatch(setCurrentModel(model_id))
}
    return ( 
        <aside className={styles['side-bar']}>
            <div className={styles['side-bar-logo']}>
            <img src={logo} alt="Логотип"  />   
            </div>
            <div className={styles['side-bar-buttons']}>
                 <button className={styles['create-chat-button']} onClick={handleCreateChat}>
<img src={addChat} alt="Добавить чат"  height={18} width={18}/>   
                 </button>
                 <button className={styles['search-button']}>
                 <img src={search} alt="Поиск"  height={18} width={18}/>   
                 </button>
            </div>
            <div className={styles['chats-list']}>
                <div className={styles['chats-items']}>

                {chats.map((chat) => (
           
 <div className={styles.chat} key={chat.id}>
    <div key={chat.id} onClick={() => setChat({id: chat.id, model_id: chat.model_id})}>
 <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.34268 14.0259L4.19971 14.9402C3.57558 15.4396 3.26336 15.6893 3.00073 15.6896C2.77233 15.6898 2.55634 15.586 2.41385 15.4075C2.25 15.2022 2.25 14.8027 2.25 14.0034V5.40015C2.25 4.56007 2.25 4.13972 2.41349 3.81885C2.5573 3.5366 2.7866 3.3073 3.06885 3.16349C3.38972 3 3.81007 3 4.65015 3H13.3501C14.1902 3 14.6101 3 14.9309 3.16349C15.2132 3.3073 15.4429 3.5366 15.5866 3.81885C15.75 4.1394 15.75 4.55924 15.75 5.39768V11.1027C15.75 11.9411 15.75 12.3604 15.5866 12.6809C15.4429 12.9631 15.2132 13.1929 14.931 13.3366C14.6105 13.5 14.1911 13.5 13.3527 13.5H6.84192C6.52989 13.5 6.37372 13.5 6.22449 13.5306C6.09209 13.5578 5.96412 13.6026 5.84376 13.6641C5.70862 13.7331 5.58723 13.8302 5.34542 14.0236L5.34268 14.0259Z" stroke="#616D8D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
{/* <span>{chat.name || 'Без названия'}</span> */}
{editingChatId === chat.id ? (
                <input 
                    type="text" 
                    className={styles['name-input']}
                    value={newChatName} 
                    onChange={handleChangeChatName} 
                    onBlur={() => handleUpdateChatName(chat.id)} 
                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                    autoFocus
                />
            ) : (
                <span onDoubleClick={() => handleEditChat(chat.id, chat.name || 'Без названия')}>
                    {chat.name || 'Без названия'}
                </span>
            )}
    </div>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleDeleteChat(chat.id)}>
<path d="M15 2.33333H12L11.1429 1.5H6.85714L6 2.33333H3V4H15M3.85714 14.8333C3.85714 15.2754 4.03775 15.6993 4.35925 16.0118C4.68074 16.3244 5.11677 16.5 5.57143 16.5H12.4286C12.8832 16.5 13.3193 16.3244 13.6408 16.0118C13.9622 15.6993 14.1429 15.2754 14.1429 14.8333V4.83333H3.85714V14.8333Z" fill="#616D8D"/>
</svg>
 </div>
                ))}
                </div>
<div className={styles['aside-user-bar']}>
<svg width="50" height="44" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_21678)">
<path d="M45 22C45 33.0457 36.0457 42 25 42C13.9543 42 5 33.0457 5 22C5 10.9543 13.9543 2 25 2C36.0457 2 45 10.9543 45 22Z" fill="#313E62"/>
<path d="M25 23.4062C26.6783 23.4062 28.2879 22.7395 29.4747 21.5528C30.6614 20.366 31.3281 18.7564 31.3281 17.0781C31.3281 15.3998 30.6614 13.7902 29.4747 12.6035C28.2879 11.4167 26.6783 10.75 25 10.75C23.3217 10.75 21.7121 11.4167 20.5253 12.6035C19.3386 13.7902 18.6719 15.3998 18.6719 17.0781C18.6719 18.7564 19.3386 20.366 20.5253 21.5528C21.7121 22.7395 23.3217 23.4062 25 23.4062ZM20.8384 24.8125C16.9229 24.8125 13.75 27.9853 13.75 31.9009C13.75 32.6479 14.3564 33.25 15.0991 33.25H34.9009C35.6479 33.25 36.25 32.6436 36.25 31.9009C36.25 27.9853 33.0772 24.8125 29.1616 24.8125H20.8384Z" fill="white"/>
</g>
<rect x="4.25" y="1.25" width="41.5" height="41.5" rx="20.75" stroke="url(#paint0_linear_1_21678)" stroke-width="1.5"/>
<defs>
<linearGradient id="paint0_linear_1_21678" x1="4.84252" y1="22" x2="44.8425" y2="22" gradientUnits="userSpaceOnUse">
<stop stop-color="#1C64F2"/>
<stop offset="1" stop-color="#D41CF2"/>
</linearGradient>
<clipPath id="clip0_1_21678">
<rect x="5" y="2" width="40" height="40" rx="20" fill="white"/>
</clipPath>
</defs>
</svg>
<span>{email}</span>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles['aside-logout']} onClick={onLogout}>
<path d="M2.77778 17C2.28889 17 1.87022 16.8258 1.52178 16.4773C1.17333 16.1289 0.999409 15.7105 1 15.2222V2.77778C1 2.28889 1.17422 1.87022 1.52267 1.52178C1.87111 1.17333 2.28948 0.999409 2.77778 1H9V2.77778H2.77778V15.2222H9V17H2.77778ZM12.5556 13.4444L11.3333 12.1556L13.6 9.88889H6.33333V8.11111H13.6L11.3333 5.84445L12.5556 4.55556L17 9L12.5556 13.4444Z" fill="#FE4242"/>
</svg>

</div>
            </div>
        </aside>
    )
}