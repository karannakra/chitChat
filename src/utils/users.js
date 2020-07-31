const users=[]

const addUser=({id,username,room})=>{
    //Clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    //Validate the data
    if(!username||!room){
        return {
            error:'Username and room are required'
        }
    }
    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    //validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }
    const user={id,username,room}
    users.push(user)
    return {
        user
    }

}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
       return user.id===id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }

}
const getUser=(id)=>{
    const user=users.find((user)=>{
            return user.id===id
    })
    if(user){
        return user
    }else {
        console.log('user does not exist')
    }

}
const getUsersInRoom=(roomName)=>{
    const room=roomName.trim().toLowerCase()
    const user=users.filter((user)=>{
        return user.room=room
    })
    if(user){
       return user
    }
    else {
        console.log('no user in this room')
    }

}
module.exports={ 
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
