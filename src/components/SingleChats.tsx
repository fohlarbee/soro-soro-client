import React, { useContext } from 'react'
import { chatContext } from '../context/ChatContext'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../services/chatLogic'
import { ProfileModal } from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'

const SingleChats = ({fetchAgain, setFetchAgain}: any) => {
    const {selectedChat, setSelectedChat, user} = useContext(chatContext)


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
        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>


    
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