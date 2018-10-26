class Users {
    constructor(){
        this.users = [];
    }
    add(id, name, room){
        const user = {
            id,
            name,
            room,
        };
        this.users.push(user);
        return user;
    }
    remove(id){
        const index = this.users.findIndex(user => user.id == id);
        if(index > -1){
            this.users = [
                ...this.users.slice(0, index),
                ...this.users.slice(index + 1, this.users.length),
            ];
        }
        return id;
    }

    get(id){
        const [ user ] = this.users.filter(user => user.id === id) || {}
        return user;
    }

    getUsersByRoom(room){
        return this.users.filter(user => user.room === room);
    }
}

module.exports = {
    Users,
};