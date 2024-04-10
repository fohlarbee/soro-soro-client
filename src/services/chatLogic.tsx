export const getSender = ({loggedUser, users} : any) => {
    // console.log('logged user',loggedUser);
    return  users[0]?._id  === loggedUser?.data.user?._id ? users[1]?.username : users[0]?.username;
}

export const getSenderFull = ({loggedUser, users} : any) => {
    return  users[0]._id  === loggedUser.data.user._id ? users[1] : users[0];


}

export const isSameSender = ({messages, m, i, user_id} : any) => {
    // console.log(messages, m , i, user_id)
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id  || 
            messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !==  user_id
    );
} 


export const isLastMessage = ({messages, i, user_id} : any) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== user_id &&
        messages[messages.length - 1].sender._id
    )
}

export const isSameSenderMargin = ({messages, m, i, user_id} : any) => {
    if(
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== user_id
    ){
        return 33
    }else if (
        ( i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== user_id) ||
            (i ===  messages.length - 1 && messages[i].sender._id !== user_id) 
    ){
        return 0
    }else return 'auto'


}



export const isSameUser = ({messages, m, i} : any) => {
    return  i > 0  && messages[i - 1].sender._id === m.sender._id;
}