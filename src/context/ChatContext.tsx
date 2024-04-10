import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface ChatContextProps {
    user: any; // Replace 'any' with the actual type of user
    setUser: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the actual type of user
    selectedChat:any,
    setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
    chats:any,
    setChats: React.Dispatch<React.SetStateAction<any>>;
    notifications:any,
    setNotifications: React.Dispatch<React.SetStateAction<any>>;
  }

export const chatContext = createContext<ChatContextProps>({
    user:null,
    setUser:() => {},
    selectedChat:null,
    setSelectedChat:() => {},
    chats:null,
    setChats:() => {},
    notifications:[],
    setNotifications:() => {}

});

const ChatProvider = ({children}: { children: ReactNode }) => {

    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([])
    const history = useHistory();


    // const handUserDetails = async() => {
    //     const res = await fetch('http://localhost:8000/api/user/auth/google/sessions', {
    //         method:'GET'
    //     })

    //     console.log('from the context', res.ok)
    //     console.log(res.json())

    // }
  

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        
        // console.log(userInfo)
        if(userInfo){
        setUser(JSON.parse(userInfo))
        console.log('present user', userInfo)
        }
        if(!userInfo){
        history.push('/');

       }

    }, [history])
    
    return <chatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications}}>
        {children}
    </chatContext.Provider>
}

export const ChatState = () => {
    return useContext(chatContext)
}


export default ChatProvider;



