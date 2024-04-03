import { CloseIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({handleFunction, user} : any) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius='10'
    margin={1}
    mb={2}
    fontSize={12}
    color='#fff'
    cursor='pointer'
    bgColor='green'
    
    >
        {user.username}
        <CloseIcon ml={3} fontSize='10' onClick={handleFunction }/>

    </Box>
  )
}

export default UserBadgeItem