import React, { useContext, useEffect, useState } from 'react'
import { chatContext } from '../context/ChatContext'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ChatLoading } from './chatLoading';
import { getSender } from '../services/chatLogic';
import GroupChatModal from './GroupChatModal';

export const MycChats = ({fetchAgain}:any) => {
  const [loggedUser, setLoggedUser] = useState()
  const {user, chats, setChats, selectedChat, setSelectedChat} = useContext(chatContext);
  const toast =useToast();
  const [error, setError] = useState('');
  


  const fetchChats = async() => {
    try {
      const res =  await fetch(`http://localhost:8000/api/chat`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${user.data.Bearer}`
        }
    })
    // console.log('is is ok', res.ok)
    const data = await res.json()
    setError(data.mssg)

    console.log('chat data', data)
    if(!res.ok){
      return toast({
        title:`${data.mssg}`,
        description:'An Error occured',
        status:'error',
        duration:5000,
        isClosable:true,
        position:'top-left'

      })
    }

    setChats(data.data)
      
    } catch (error) {

      return toast({
        title: `${error}`,
        description:'Unable to fetch your chats',
        status:'warning',
        duration:5000,
        isClosable:true,
        position:'top-left'
      })
      
    }
  }
  

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    // console.log(userInfo)
    if(userInfo){
    setLoggedUser(JSON.parse(userInfo))
    }
    fetchChats()
    // if(!userInfo){
    // history.push('/');
  //  } 
  }, [fetchAgain])
  return (
    <Box
    display={{base: selectedChat ? 'none' : 'flex', md:'flex'}}
    flexDirection='column'
    alignItems='center'
    // justifyContent='center'
    p={3}
    bg='#fff'
    width={{base:'100%', md: '31%'}}
    borderRadius='1g'
    borderWidth='1px'
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base:'22px', md:'17px'}}
      fontFamily='Work sans'
      display='flex'
      width='100%'
      justifyContent='space-between'
      alignItems='center'
      >
        My Chats
        <GroupChatModal>
           <Button
            fontSize={{base:'10px', md:'8px', lg:'17px'}}
            display='flex'
          rightIcon={<AddIcon/>}
            >
          Create new group
          </Button>
        </GroupChatModal>
        
        
        
        
        
        

        
      </Box>
      <Box
      display='flex'
      flexDirection='column'
      p={3}
      bg='#f8f8f8'
      width='100%'
      height='100%'
      borderRadius='1g'
      overflowY='hidden'

      >

    {chats ? 

      (
        <Stack overflowY= 'scroll'>
          {chats.map((chat: any) => (
            <Box
            onClick={() => setSelectedChat(chat)}
            cursor='pointer'
            key={chat._id}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            px={3}
            py={2}
            bg={selectedChat === chat  ? '#38b2ac' : '#e8e8e8'}
            color={selectedChat  === chat ? '#fff' : '#000'}
            width='100%'
            borderRadius='1g'
            borderWidth='1px'
            >
              <Text>
                {!chat.isGroupChat ? getSender({loggedUser, users:chat.users}) : chat.chatName}
              </Text>
            </Box>
          ))}
        </Stack>
      )

    : 
    <ChatLoading/>
    }
   
  
      </Box>

    </Box>
  
  );
};
 