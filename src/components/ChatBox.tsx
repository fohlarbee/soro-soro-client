import React, { useContext } from 'react'
import { chatContext } from '../context/ChatContext'
import { Box } from '@chakra-ui/react'
import SingleChats from './SingleChats'



export const ChatBox = ({fetchAgain, setFetchAgain}: any) => {
const {selectedChat} = useContext(chatContext)

  return (
    <Box
    display={{base: selectedChat ? 'flex' : 'none', md:'flex'}}
    alignItems='ceneter'
    flexDirection='column'
    p={3}
    bg='#fff'
    width={{base:'100%', md:'68%'}}
    borderRadius='1g'
    borderWidth='1px'
    >
      <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}
