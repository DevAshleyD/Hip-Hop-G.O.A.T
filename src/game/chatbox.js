import React, {Component} from 'react';
import Plus from 'react-icons/lib/fa/plus'
import ScrollArea from 'react-scrollbar';


class ChatBox extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            message: "",
            chat: [],
            userEmail: "",
            password: "",
            email: "",
            isLoggedIn: false,
            userConversations: [],
            activeConversationID: 0,
            flaggedConversations: [],
            generalChat: ["Welcome to general chat"],
            offlineRequests: [],
            onlineRequests: [],
            friends: []
        };
    }

    componentDidMount() {
        this.ws = new WebSocket('ws://localhost:9000/chat');
        this.setUpWebSocket(this.ws)
    }

    setUpWebSocket(socket) {
        socket.onmessage = (e) => {
            const json = JSON.parse(e.data);
            if (json.messageType === "User") {
                console.log(json.data.email);
                this.setState({userEmail: json.data.email});
                this.setState({username: json.data.username});
                this.setState({userConversations: json.data.conversationIDs});
                this.setState({offlineRequests: json.data.friendRequests});
                this.setState({friends: json.data.friends})
                this.setState({isLoggedIn: true});
            }
            else if (json.messageType === "say") {
                console.log(json.data);
                const gc = this.state.generalChat;
                const message = this.createMessage(json.data);
                gc.push(json.data);
                this.setState({generalChat: gc});
                if (this.state.activeConversationID !== 0) {
                    const flagged = this.state.flaggedConversations;
                    let exists = false;
                    flagged.forEach(conv => {
                        if (conv.id === 0) {
                            conv.count++;
                            exists = true
                        }
                    });
                    if (!exists) flagged.push({
                        id: 0,
                        count: 1
                    });
                    this.setState({flaggedConversations: flagged});
                }
            }
            else if (json.messageType === "conversation") {
                console.log(json.data);
                if (this.state.activeConversationID === json.data.id) {
                    this.setState({activeConversationID: json.data.id});
                    console.log(json.data.messages)
                    const chat = this.createChatEntry(json.data.messages);
                    this.setState({chat: chat});
                } else {
                    const flagged = this.state.flaggedConversations;
                    let exists = false;
                    flagged.forEach(conv => {
                        if (conv.id === json.data.id) {
                            conv.count++;
                            exists = true
                        }
                    });
                    if (!exists) flagged.push({
                        id: json.data.id,
                        count: 1
                    });
                    this.setState({flaggedConversations: flagged});
                }


            }
            else if (json.messageType === "conversationUpdate") {
                const convos = this.state.userConversations;
                convos.push(json.data);
                this.setState({
                    userConversations: convos
                })
            }
            else if (json.messageType === "friendRequest") {
                const onlineRequests = this.state.onlineRequests;
                onlineRequests.push(json.data);
                this.setState({
                    onlineRequests
                });
            }
            else if (json.messageType === "friendsUpdate"){
                this.setState({
                    friends: json.data
                })
            }
            /*
                        this.addMsgToChat(e)
            */
        };
    }

    createChatEntry(messages) {
        /*return messages.map(message => {
            return message.username + ": " + message.message
        })*/
        return messages.map(message => {
            return <div className="messageWrapper">
                {message.username + ": " + message.message}<span
                onClick={this.handleFriendReq.bind(this, message.userEmail)}
                className="friendIcon"><Plus/></span>
            </div>
        })
    }

    createMessage(message){
        return <div className="messageWrapper">
            {message.username + ": " + message.message}<span
            onClick={this.handleFriendReq.bind(this, message.userEmail)}
            className="friendIcon"><Plus/></span>
        </div>
    }

    onChange(e) {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    getConversation(id) {
        this.setState({activeConversationID: id});
        console.log(this.state.activeConversationID);
        const flagged = this.state.flaggedConversations;
        console.log(flagged);
        const filteredList = flagged.filter(item => {
            return !(item.id === id)
        });
        console.log(filteredList);
        this.setState({flaggedConversations: filteredList});
        this.ws.send(JSON.stringify({
            type: "getConversation",
            data: {
                userEmail: this.state.userEmail,
                conversationID: id
            }
        }))
    }

    handleSendMessage(e) {
        e.preventDefault();
        if (this.state.activeConversationID === 0) {
            this.ws.send(JSON.stringify({
                type: "say",
                data: {
                    username: this.state.username,
                    message: this.state.message
                }
            }))
        } else {
            this.ws.send(JSON.stringify({
                type: "privateMessage",
                data: {
                    userEmail: this.state.userEmail,
                    username: this.state.username,
                    message: this.state.message,
                    conversationID: this.state.activeConversationID
                }
            }));
        }

        this.setState({message: ""})
    }

    handleFriendReq(email) {
        this.ws.send(JSON.stringify({
            type: "friendRequest",
            data: {
                senderUsername: this.state.username,
                senderEmail: this.state.userEmail,
                receiver: email
            }
        }))
    }

    handleUpdateCount(id) {
        let count = null;
        this.state.flaggedConversations.forEach(conversation => {
            if (id === conversation.id) {
                count = conversation.count
            }
        });
        if (count !== null) return <span className="container countBadge col-1">{count}</span>
    }

    handleLogIn(e) {
        e.preventDefault();
        console.log(this.state.email + " " + this.state.password);
        this.ws.send(JSON.stringify({
            type: "login",
            data: {
                email: this.state.email,
                password: this.state.password
            }
        }))
    }

    friendList(){

    }

    acceptRequest(request) {
        this.ws.send(JSON.stringify({
            type: "acceptRequest",
            data: {
                acceptedByEmail: this.state.userEmail,
                acceptedByUsername: this.state.username,
                friendEmail: request.userEmail,
                friendName: request.username
            }
        }))
    }

    startConversation(email, name){
        this.ws.send(JSON.stringify({
            type: "newFriendChat",
            data: {
                username: this.state.username,
                userEmail: this.state.userEmail,
                friendEmail: email,
                friendName: name
            }
        }))
    }

    findSelected(conversation) {
        if (!(conversation.id === this.state.activeConversationID)) {
            return <div className="row">
                <div className="conversation col-8"
                     onClick={this.selectConversation.bind(this, conversation.id)}>
                    {conversation.name}
                </div>
                <hr/>
                {this.handleUpdateCount(conversation.id)}
                <hr/>
            </div>
        } else {
            return <div className="row">
                <div className="col-12 conversation" id="selectedConvo">
                    <div
                        onClick={this.selectConversation.bind(this, conversation.id)}>
                        {conversation.name}
                    </div>
                </div>

                {this.handleUpdateCount(conversation.id)}
                <hr/>
            </div>
        }
    }

    generalChats() {
        if (this.state.activeConversationID === 0) {
            return (
                <div className="row">
                    <div className="conversation col-12" id="selectedConvo"
                         onClick={this.selectConversation.bind(this, 0)}>
                        General
                    </div>
                    {this.handleUpdateCount(0)}
                    <hr/>
                </div>
            )
        } else {
            return (
                <div className="row">
                    <div className="conversation col-8"
                         onClick={this.selectConversation.bind(this, 0)}>
                        General
                    </div>
                    {this.handleUpdateCount(0)}
                    <hr/>
                </div>
            )
        }

    }

    showConversations() {
        if (this.state.isLoggedIn) {
            const html = this.state.userConversations.map(conversation => {
                return this.findSelected(conversation)
            });

            return (
                <div>
                    <h4>My Conversations</h4>
                    <hr/>
                    <hr/>
                    <div className="conversationFrame">
                        {this.generalChats()}
                        {html}
                    </div>
                    <button id="convoButton" className="game-button">Start a new conversation</button>
                </div>
            )
        }
    }

    handleOnlineRequests() {
        const requests = this.state.onlineRequests.map(request => {
            return <div>
                New friend request from {request.username}
                <button onClick={this.acceptRequest.bind(this, request)}>Accept</button>
                <button onClick={this.acceptRequest.bind(this, request)}>Decline</button>
            </div>
        });
        return <div>{requests}</div>
    }

    handleOfflineRequests() {
        const requests = this.state.offlineRequests.map(request => {
            return <div>
                New friend request from {request.username}
                <button className="game-button" onClick={this.acceptRequest.bind(this, request)}>Accept</button>
                <button className="game-button" onClick={this.acceptRequest.bind(this, request)}>Decline</button>
            </div>
        });
        return <div>{requests}</div>
    }

    selectConversation(id) {
        this.getConversation(id);
    }



    scrollToBottom() {
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    showFriends(){
        return this.state.friends.map(friend =>{
            return <div onClick={this.startConversation.bind(this, friend.email, friend.name)}>
                {friend.name}
            </div>
        })
    }

    showChat() {
        if (!this.state.isLoggedIn) {

            return (
                <div id="pleaseLogIn">
                    <div >PLEASE LOG IN TO CHAT</div>
                    <div className="logIn container">
                        <form id="nameForm" onSubmit={this.handleLogIn.bind(this)}>
                            <div id="logInDetails">
                                <input className="textInput" placeholder="email" type="text" name="email" value={this.state.email}
                                       onChange={this.onChange.bind(this)}/>
                                <input className="textInput" placeholder="password" type="password" name="password" value={this.state.password}
                                       onChange={this.onChange.bind(this)}/>
                            </div>
                            <button className="game-button" type="submit" form="nameForm">Log In</button>
                        </form>
                    </div>
                </div>

            )

        }
        else if (this.state.activeConversationID === 0 && this.state.isLoggedIn) {
            console.log(this.state.generalChat)
            return this.state.generalChat.map(message => {
                return <p>{message}</p>
            })
        } else {
            const chat = this.state.chat.map(message => {
                return <p>{message}</p>
            });
            return <div>{chat}</div>
        }


    }

    render() {
        if (this.state.isLoggedIn){
            return (
                <div className="container chat">

                    <div className="container" id="chatDisplay">
                        <p>{this.state.username}</p>
                        <div className="row">
                            <div className="col-4 nopadding-right">
                                <ScrollArea className="chatConversations" horizontal={false}>
                                    <div>
                                        {this.showConversations()}

                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="col-8 nopadding-left">
                                <ScrollArea className="chatText" horizontal={false}>
                                    <div>
                                        {this.showChat()}
                                    </div>
                                </ScrollArea>
                            </div>
                            <hr/>
                        </div>
                        {this.logInCheck()}
                    </div>
                    <hr/>

                </div>


            )
        }else {
            return(
                <div className="container chat">
                    <div className="container" id="chatDisplay">
                        <div id="pleaseLogIn">
                            <div >PLEASE LOG IN TO CHAT</div>
                            <div className="logIn container">
                                <form id="nameForm" onSubmit={this.handleLogIn.bind(this)}>
                                    <div id="logInDetails">
                                        <input className="textInput" placeholder="email" type="text" name="email" value={this.state.email}
                                               onChange={this.onChange.bind(this)}/>
                                        <input className="textInput" placeholder="password" type="password" name="password" value={this.state.password}
                                               onChange={this.onChange.bind(this)}/>
                                    </div>
                                    <button className="btn-info game-button" type="submit" form="nameForm">Log In</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }

    }


    logInCheck() {
        if (!this.state.isLoggedIn) {
            return
        } else {
            return (
                <div className="container">
                    <form id="messageForm" onSubmit={this.handleSendMessage.bind(this)}>
                        <div>
                            Message:
                            <input className="textInput" type="text" name="message" value={this.state.message}
                                   onChange={this.onChange.bind(this)}/>
                            <button className="game-button" type="submit" form="messageForm">Send</button>
                        </div>
                    </form>

                    <div>
                        {this.handleOnlineRequests()}
                    </div>
                    <div>
                        {this.handleOfflineRequests()}
                    </div>
                    <div>
                        <div>
                            My Friends:
                        </div>
                        {this.showFriends()}
                    </div>
                </div>

            )
        }
    }
}

export default ChatBox;