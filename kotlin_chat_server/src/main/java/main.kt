import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.eclipse.jetty.websocket.api.Session
import org.eclipse.jetty.websocket.api.annotations.*
import spark.Spark.*
import java.util.concurrent.atomic.AtomicLong
import database.*

fun main(args: Array<String>) {
    val dbHandler = DBHandler()
    dbHandler.populateDB()
    setupSpark(9000, "/chat")
}

fun setupSpark(port: Int, webSocketAddress: String){
    port(port)
    webSocket(webSocketAddress, ChatWSHandler::class.java)
    init()
}

//user object
data class UserSessionInfo(val session: Session, var activeChatID: Int)

//message object
class Payload(val messageType: String, val data: Any)

@WebSocket
class ChatWSHandler{

    val dbHandler = DBHandler()


    val generalChat = Conversation(ArrayList<Message>(), 0, ArrayList<String>())
    val groupChatID = 0
    val userConnections = HashMap<String, UserSessionInfo>()
    val users = HashMap<Session, User>()
    var userIDs = AtomicLong(0)

    @OnWebSocketConnect
    fun connected(session: Session) = println("session connected")

    @OnWebSocketMessage
    fun message(session: Session, payload: String) {
        //get json object
        val json = ObjectMapper().readTree(payload)
        val data = json.get("data")
        //use it
        when (json.get("type").asText()) {
            "join" -> {
                /*val user = User(userIDs.getAndIncrement(), json.get("data").asText())
                users.put(session, user)*/
                //tell this user about all other users
/*
                emit(session, Message("users", users.values))
*/
                //tell all other users about this user
/*
                broadcastToOthers(session, Message("join", user))
*/
            }
            "newUser" ->{
                val user = dbHandler.saveNewUser(
                        data.get("username").asText(),
                        data.get("email").asText(),
                        data.get("password").asText()
                )
                emit(session,Payload("User", user))
            }
            "say" -> {
                println("In say")

                val name = data.get("username").asText()
                val message = name + ": " + data.get("message").asText()
                println(name)
                broadcast(Payload("say", message))
            }
            "login" ->{
                if (dbHandler.checkUserDetails(data.get("email").asText(),
                        data.get("password").asText())){
                    val user: User? = dbHandler.findUser(data.get("email").asText())
                    userConnections.put(user!!.email, UserSessionInfo(session, groupChatID))
                    emit(session, Payload("User", user))
                }else{
                    emit(session, Payload("LoginError", "Invalid credentials"))
                }
            }
            "privateMessage" ->{
                //add message to conversation using conversationID
                println("Received private message")
                try {
                    val username = data.get("username").asText()
                    val message = data.get("message").asText()
                    val conversationID = data.get("conversationID").asInt()
                    val userEmail = data.get("userEmail").asText()
                    println(username + message + conversationID)
                    dbHandler.addMessageToConversation(userEmail, username, message, conversationID)
                    val updatedConversation = dbHandler.getConversation(conversationID)

                    println(updatedConversation)
                    //find all member's sessions belonging to conversation
                    val sessionsToSendTo = ArrayList<Session>()
                    updatedConversation.memberEmails.forEach { email ->
                        if (userConnections.containsKey(email)) {
                            sessionsToSendTo.add(userConnections[email]!!.session)
                        }
                    }

                    //send out updated conversation
                    sessionsToSendTo.forEach { emit(it, Payload("conversation", updatedConversation)) }
                } catch (e: Exception) {
                    e.printStackTrace()
                }


            }
            "getConversation" ->{
                val conversation: Conversation?
                val id = data.get("conversationID").asInt()
                val email = data.get("userEmail").asText()
                conversation = if (id == 0){
                    generalChat
                }else{
                    dbHandler.getConversation(id)
                }
                emit(session, Payload("conversation", conversation))
                updateActiveConversation(id, email)
                println(userConnections[email]!!.activeChatID)
            }
            "joinConversation" ->{

            }
            "friendRequest" ->{
                val senderEmail = data.get("senderEmail").asText()
                val senderUsername = data.get("senderUsername").asText()
                val payload = FriendRequest(senderUsername, senderEmail)
                val receiver = data.get("receiver").asText()
                dbHandler.addFriendRequest(FriendRequest(senderUsername, senderEmail), receiver)
                if (userConnections.keys.contains(receiver)){
                    emit(userConnections[receiver]!!.session, Payload("friendRequest", payload))
                }
            }
            "acceptRequest" ->{
                val username = data.get("acceptedByUsername").asText()
                val userEmail = data.get("acceptedByEmail").asText()
                val friendName = data.get("friendName").asText()
                val friendEmail = data.get("friendEmail").asText()
                dbHandler.addFriend(userEmail, friendEmail, friendName)
                dbHandler.addFriend(friendEmail, userEmail, username)
                val userFriends = dbHandler.getFriends(userEmail)
                val friendFriends = dbHandler.getFriends(friendEmail)
                emit(userConnections[userEmail]!!.session, Payload("friendsUpdate", userFriends))
                if (userConnections.containsKey(friendEmail)){
                    emit(userConnections[friendEmail]!!.session, Payload("friendsUpdate", friendFriends))
                }
            }
            "newFriendChat" ->{
                try {
                    val memberEmails = ArrayList<String>()
                    val userEmail = data.get("userEmail").asText()
                    val friendEmail = data.get("friendEmail").asText()
                    memberEmails.add(userEmail)
                    memberEmails.add(friendEmail)
                    val user = data.get("username").asText()
                    val friend = data.get("friendName").asText()

                    val cID = dbHandler.newConversation(userEmail, friend, memberEmails)
                    val conversationID = ConversationID(user, cID.id)
                    val friendObject = dbHandler.findUser(friendEmail)
                    dbHandler.addConversationIDToUser(friendObject!!, conversationID)

                    val friendConvoIDs = dbHandler.findUser(friendEmail)!!.conversationIDs
                    val userConvoIDs = dbHandler.findUser(userEmail)!!.conversationIDs
                    if (userConnections.containsKey(friendEmail)){
                        emit(userConnections[friendEmail]!!.session, Payload("conversationUpdate", conversationID))
                    }
                    emit(userConnections[userEmail]!!.session, Payload("conversationUpdate", cID))



                }catch (e: Exception){
                    e.printStackTrace()
                }

            }
        }
    }




    @OnWebSocketClose
    fun disconnect(session: Session, code: Int, reason: String?) {
        userConnections.map { if (it.value.session == session){
            userConnections.remove(it.key)
        } }
        val user = users.remove(session)

        if (user != null) broadcast(Payload("left", user))
    }

    private fun updateActiveConversation(conversationID: Int, email: String){
        userConnections[email]!!.activeChatID = conversationID
    }

    private fun emitUser(session: Session, user: User, type: String) = session.remote.sendString(jacksonObjectMapper().writeValueAsString(user))

    private fun emit(session: Session, payload: Payload) = session.remote.sendString(jacksonObjectMapper().writeValueAsString(payload))

    fun broadcast(message: Payload) = userConnections.forEach() {emit(it.value.session, message)}

    private fun broadcastToOthers(session: Session, message: Payload) {
        users.filter { it.key != session }.forEach(){emit(it.key, message)}
    }
}