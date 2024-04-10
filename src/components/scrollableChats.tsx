import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../services/chatLogic'
import { chatContext } from '../context/ChatContext'
import { Avatar, Tooltip } from '@chakra-ui/react'
import './../styles/messages.css'
const ScrollableChats = ({messages }: any) => {

    const {user} = useContext(chatContext)
    // console.log(user.data.user._id)
  return (
    <ScrollableFeed forceScroll  className='scrollable'>
        {messages.map((m:any, i: number) => (
            <div style={{display:'flex'}} key={m._id}>


                {
                    
                    (isSameSender({ messages, m, i, user_id:user.data.user._id }) ||
                    isLastMessage({messages, i, user_id:user.data.user._id}) 


                    )  &&
                    ( <Tooltip label={m.sender.username} placement='bottom-start' hasArrow>
                    <Avatar
                    mt={7}
                    mr={1}
                    size='sm'
                    cursor='pointer'
                    name={m.sender.username}
                    src={m.sender.avatar}
                    />
                </Tooltip>)  }

                <span style={{
                    backgroundColor: `${m.sender._id === user.data.user._id ? '#bee3f8' : '#89f5d0 '}`,
                    borderRadius:'20px',
                    padding:12, 
                    maxWidth:'75%',
                    marginLeft: isSameSenderMargin({ messages, m, i, user_id:user.data.user._id }),
                    marginTop: isSameUser({messages, m, i}) ? 3 : 10
                }}>
                    {m.content}
                </span>


            



            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChats