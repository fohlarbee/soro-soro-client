import React, { useContext } from 'react'
import { chatContext } from '../context/ChatContext'
import { Avatar, Box, Text } from '@chakra-ui/react';

export const UserListItem = ({ handleFunction, user} :any) => {
    // console.log('user from userlist', user.avatar)


  return (
    <Box 
    
    onClick={handleFunction}
    cursor='pointer'
    bg='#e8e8e8'
    _hover={{
        backgroud:'#38b2ac',
        color:'#fff',
    }}
    width='100%'    
    display='flex'
    alignItems='center'
    color='#000'
    px={3}
    py={2}
    mb={2}
    borderRadius='1g'
    >
        <Avatar
        mr={2}
        size='sm'
        cursor='pointer'
        name={user.username}
        src={user.avatar}
        />
        <Box>
            <Text>{user.username}</Text>
            <Text fontSize='12px'>
                <b>Email: </b>
                {user.email}
            </Text>
        </Box>

    </Box>
  )
}
