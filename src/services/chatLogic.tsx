export const getSender = ({loggedUser, users} : any) => {
    console.log('this is users',users)
    return  users[0]._id  === loggedUser.data.user._id ? users[1].username : users[0].username;
}

export const getSenderFull = ({loggedUser, users} : any) => {
    return  users[0]._id  === loggedUser.data.user._id ? users[1] : users[0];


}