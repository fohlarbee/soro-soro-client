import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../context/ChatContext'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull, isSameSenderMargin } from '../services/chatLogic'
import { ProfileModal } from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import './../styles/messages.css'
import ScrollableChats from './scrollableChats'
import { io } from 'socket.io-client'
import Lottie from 'react-lottie'




const ENDPOINT = 'http://localhost:8000'
let  socket: any 
let selectedChatCompare: any


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: require('../animation/typing.json'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}


const SingleChats = ({fetchAgain, setFetchAgain}: any) => {

  const {selectedChat, setSelectedChat, user, notifications, setNotifications} = useContext(chatContext)

   const [messages, setMessages] = useState<any>([]);
   const [loading, setLoading] = useState(true);
   const [newMessage, setNewMessage] = useState<any>();
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [isTyping, setIsTyping] = useState(false)
   const toast = useToast()



   useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('setup', user.data.user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false))

     
   }, [])

   const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let presentTime = new Date().getTime();
      let timeDiff = presentTime - lastTypingTime;

      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }

    }, timerLength)

  }


    const sendmesaage = async(e:  any )=> {
      if(e.key === 'Enter' && newMessage){

        socket.emit('stop typing', selectedChat._id)

         try {
            setLoading(true);
            setNewMessage('')


            const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/message`, {
                method: 'Post',
                headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${user.data.Bearer}`
                },
                body:JSON.stringify({content:newMessage, chat_id:selectedChat._id})
            })

            const data = await res.json()
          if(!res.ok){
              setLoading(false)
              return toast({
                  title:`${data.mssg}`,
                  description:'An Error occured',
                  status:'error',
                  duration:5000,
                  isClosable:true,
                  position:'top'
              })
          }

          socket.emit('new message', data.data)
          setMessages([...messages, data.data])
          setLoading(false)

            
         } catch (error) {
          if(error instanceof Error){
            setLoading(false);
            return toast({
                title:`Something went wrong`,
                description:'Failed to send message',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'top'
            })
        }  
            
         }  

      }

    }

    const fetchMessages = async() => {
      
      try {
        if(!selectedChat)  return;

        const chat_id = selectedChat._id

        setLoading(true)

        const res =  await fetch(`${process.env.REACT_APP_ROOT_API_URL}/api/chat/message/${chat_id}`, {
          method: 'Get',
          headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${user.data.Bearer}`
          },
      })

      const data = await res.json()
      if(!res.ok){
          setLoading(false)
          return toast({
              title:`${data.mssg}`,
              description:'An Error occured',
              status:'error',
              duration:5000,
              isClosable:true,
              position:'top'
          })
      }

      setMessages(data.data)
      setLoading(false)
      socket.emit('join chat', selectedChat._id)


        
      } catch (error) {
        if(error instanceof Error){
          setLoading(false);
          return toast({
              title:`${error.message}`,
              description:'Failed to fetch chats',
              status:'error',
              duration:5000,
              isClosable:true,
              position:'top'
          })
      }  
        
      }
    }

    useEffect(() => {
      fetchMessages();
      selectedChatCompare = selectedChat;

    }, [selectedChat]);
    


    useEffect(() => {
      socket.on('message recieved', (newMessageReceived: any) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
          if(!notifications.includes(newMessageReceived)){
            setNotifications([newMessageReceived, ...notifications]);
            setFetchAgain(!fetchAgain)
          }
        }else{
          setMessages([...messages, newMessageReceived]);
        }
      });
    });

    

  return (
    <>
     {selectedChat 
     ? (<><Text
     fontSize={{base:'20px', md:'15px'}}
     pb={3}
     px={2}
     width='100%'
     fontFamily='Work sans'
     display='flex'
     justifyContent={{base:'space-between'}}
     alignItems='center'
     >
        <IconButton
        display={{base:'flex', md:'none'}}
        icon={<ArrowBackIcon />}
        onClick={() => setSelectedChat('')}
        aria-label='fill'
        color='red'
        />
        {!selectedChat.isGroupChat ?
        (<>
        {getSender({ loggedUser: user, users:selectedChat.users})}
        <ProfileModal user={getSenderFull({loggedUser:user, users: selectedChat.users})}/>
        </>)
        : 
        (<>
        <Text>{ selectedChat.chatName.toUpperCase()}</Text>
        <UpdateGroupChatModal fetchAgain={fetchAgain} 
        fetchMessages={fetchMessages}
        setFetchAgain={setFetchAgain}/>


    
        </>
       
       
       
        )
        }

     </Text>
     <Box
  display='flex'
  flexDirection='column'
  justifyContent='flex-end'
  p={3}
  bg='#e8e8e8'
  width='100%'
  height='100%'
  borderRadius='1g'
  overflowY='hidden'
  >

    {loading ? 
    (<Spinner color='green' 
    size='xl' 
    width={20} 
    height={20} 
    display='flex'
    alignSelf='center' 
    margin='auto'
    />)
    :
    (<div className=''>
      <ScrollableChats   messages={messages}/>
    </div>
    )}
      {/* onKeyDown={sendmesaage} */}
    <FormControl  isRequired mt={3} onKeyDown={sendmesaage}>
      {isTyping ? <div>
        <Lottie
        width={70}
        style={{marginBottom:15, marginLeft:5, background:'#e8e8e8'}}
        options={defaultOptions}
        />
      </div> : null}
      <Input
      variant='filled'
      bg='#eee'
      // borderWidth={1}
      borderColor='#fff'
      placeholder='say something...'
      onChange={(e) => typingHandler(e)}
      value={newMessage}

      />

    </FormControl>
  </Box>
     </>


     )
     : (<Box
     display='flex'
     alignItems='center'
     justifyContent='center'
     height='100%'
     >
        <Text
        fontSize='2xl'
        fontFamily='Work sans'
        pb={3}
        color='grey'
        >Click on a Chat to start a Conversion</Text>
     </Box>)
    }
    </>

  )
}

export default SingleChats