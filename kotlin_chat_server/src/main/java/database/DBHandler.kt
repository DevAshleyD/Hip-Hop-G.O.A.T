package database

import org.eclipse.jetty.websocket.api.Session
import org.litote.kmongo.*
import kotlin.collections.ArrayList

data class User(
        val username: String,
        val email: String,
        val password: String,
        val conversationIDs: ArrayList<ConversationID>,
        val friendRequests: ArrayList<FriendRequest>,
        val friends: ArrayList<Friend>
)

data class Friend(val name: String, val email: String)

data class FriendRequest(val username: String, val userEmail: String)

class ConversationID(val name: String, val id: Int)

class Conversation(val messages: ArrayList<Message>, val id: Int, val memberEmails: ArrayList<String>)

class Message(val userEmail: String, val username: String, val message: String)

class DBHandler {
    var idGenerator = 100

    val RECEIVED = "RECEIVED"
    val REQUESTED = "REQUESTED"
    val REJECTED = "REJECTED"
    val REFUSED = "REFUSED"
    val FRIEND = "FRIEND"

    var client = KMongo.createClient()
    var database = client.getDatabase("chat")!!
    private val userCollection = database.getCollection<User>()
    private val conversationCollection = database.getCollection<Conversation>()

    fun saveNewUser(username: String, email: String, password: String): User {
        val conversationIDs = ArrayList<ConversationID>()
        val user = User(username, email, password, conversationIDs, ArrayList(), ArrayList())
        userCollection.insertOne(user)
        return user
    }

    fun addMessageToConversation(userID: String, username: String, message: String, id: Int) {
        val messages = conversationCollection.findOne("{id:${id.json}}")!!.messages
        messages.add(Message(userID, username, message))
        conversationCollection.updateOne(
                "{id:${id.json}}",
                "{${MongoOperator.set}:{messages:${messages.json}}}"
        )
    }

    private fun dropCollection() {
        println("DROPPING COLLECTION")
        database.drop()
    }

    fun newConversation(userEmail :String, name: String, memberEmails: ArrayList<String>): ConversationID{
        val id = idGenerator++
        val conversation = Conversation(ArrayList(), id, memberEmails)
        val conversationID = ConversationID(name, id)
        val userToUpdate = findUser(userEmail)
        conversationCollection.insertOne(conversation)
        addConversationIDToUser(userToUpdate!!, conversationID)
        return conversationID
    }

    fun addFriend(userEmail: String, friendEmail: String, friendName: String){
        val query = "{email:${userEmail.json}}"
        val userFriends = userCollection.findOne(query)!!.friends
        userFriends.add(Friend(friendName, friendEmail))
        userCollection.updateOne(
                query,
                "{${MongoOperator.set}:{friends:${userFriends.json}}}"
        )
    }

    fun addUsernameToConversation() {

    }

    fun getFriends(email: String): ArrayList<Friend>{
        return userCollection.findOne("{email:${email.json}}")!!.friends
    }

    fun addFriendRequest(sender: FriendRequest, receiver: String) {
        val requests = userCollection.findOne("{email:${receiver.json}}")!!.friendRequests
        requests.add(sender)
        userCollection.updateOne(
                "{email:${receiver.json}}",
                "{${MongoOperator.set}:{friendRequests:${requests.json}}}"
        )
    }

    fun addConversationIDToUser(chatUser: User, conversationID: ConversationID) {
        val chatIDs = chatUser.conversationIDs
        chatIDs.add(conversationID)
        userCollection.updateOne(
                "{email:${chatUser.email.json}}",
                "{${MongoOperator.set}:{conversationIDs:${chatIDs.json}}}"
        )
    }


    fun getConversation(id: Int): Conversation {
        return conversationCollection.findOne("{id:${id.json}}")!!
    }

    fun saveUser(user: User) {
        userCollection.insertOne(user)
    }

    fun checkUserExists(email: String): Boolean {
        return false
    }

    fun checkUserDetails(email: String, password: String): Boolean {
        val user = userCollection.findOne("{email:${email.json}}") ?: return false
        return user.password == password
    }

    fun findUser(email: String): User? {
        return userCollection.findOne("{email:${email.json}}")
    }

    fun updateUserSession(email: String, session: Session) {
        userCollection.updateOne("{email:${email.json}}", "{${MongoOperator.set}:{socketSession:${session.json}}}")
    }


    /*fun main(args: Array<String>) {
        testDB()
    }*/

    fun testDB() {


    }

    fun connect() {

    }

    fun populateDB() {
        dropCollection()

        val sam = "Sam"
        val tina = "Tina"
        val gerry = "Gerry"
        val mohammed = "Mohammed"
        val rickard = "Rickard"
        val rachel = "Rachel"
        val amanda = "Amanda"
        val martin = "Martin"
        val sara = "Sara"
        val bob = "Bob"

        val samEmail = "sam@mail"
        val tinaEmail = "tina@mail"
        val gerryEmail = "gerry@mail"
        val mohammedEmail = "mohammed@mail"
        val rickardEmail = "rickard@mail"
        val rachelEmail = "rachel@mail"
        val amandaEmail = "amanda@mail"
        val martinEmail = "martin@mail"
        val saraEmail = "sara@mail"
        val bobEmail = "bob@mail"

        val messages1 = ArrayList<Message>()
        val messages2 = ArrayList<Message>()

        val c1name = "Happy Chat"
        val c2name = "Sad Chat"
        val c3name = "Love Chat"
        val c4name = "Puppy Chat"
        val c5name = "Rap Chat"
        val c6name = "Quiet Chat"
        val c7name = "Fruit Chat"
        val c8name = "What Chat"
        val c9name = "Something Chat"
        val c10name = "Stop This Chat"

        val c1ID = 11
        val c2ID = 12
        val c3ID = 13
        val c4ID = 14
        val c5ID = 15
        val c6ID = 16
        val c7ID = 17
        val c8ID = 18
        val c9ID = 19
        val c10ID = 20


        val members = ArrayList<String>()
        val members2 = ArrayList<String>()
        val members3 = ArrayList<String>()
        val members4 = ArrayList<String>()
        val members5 = ArrayList<String>()

        val password = "123"

        members.add(bobEmail)
        members.add(samEmail)
        members.add(saraEmail)
        members.add(tinaEmail)

        members2.add(amandaEmail)
        members2.add(martinEmail)
        members2.add(samEmail)

        members3.add(saraEmail)
        members3.add(samEmail)
        members3.add(mohammedEmail)

        members3.add(samEmail)



        messages1.add(Message(samEmail, sam, "Hey"))
        messages1.add(Message(samEmail, sam, "How is everyone?"))
        messages1.add(Message(bobEmail, bob, "Great!"))
        messages1.add(Message(bobEmail, bob, "U R so cool"))
        messages1.add(Message(saraEmail, sara, "UR so cool bob!"))

        messages2.add(Message(amandaEmail, amanda, "Hey"))
        messages2.add(Message(martinEmail, martin, "How r u?"))
        messages2.add(Message(tinaEmail, tina, "Bad"))
        messages2.add(Message(bobEmail,bob, "Me too"))
        messages2.add(Message(amandaEmail ,amanda, "My cat is sick"))
        messages2.add(Message(rachelEmail, rachel, "Oh no!"))
        messages2.add(Message(amandaEmail, amanda, "Hey"))
        messages2.add(Message(martinEmail, martin, "How r u?"))
        messages2.add(Message(tinaEmail, tina, "Bad"))
        messages2.add(Message(bobEmail,bob, "Me too"))
        messages2.add(Message(amandaEmail ,amanda, "My cat is sick"))
        messages2.add(Message(rachelEmail, rachel, "Oh no!"))


        val c1 = Conversation(messages1, c1ID, members)
        val c2 = Conversation(messages2, c2ID, members2)
        val c3 = Conversation(messages2, c3ID, members)
        val c4 = Conversation(messages1, c4ID, members)
        val c5 = Conversation(messages2, c5ID, members)
        val c6 = Conversation(messages2, c6ID, members)
        val c7 = Conversation(messages1, c7ID, members)
        val c8 = Conversation(messages2, c8ID, members)
        val c9 = Conversation(messages2, c9ID, members)
        val c10 = Conversation(messages1, c10ID, members)

        conversationCollection.insertOne(c1)
        conversationCollection.insertOne(c2)
        conversationCollection.insertOne(c3)
        conversationCollection.insertOne(c4)
        conversationCollection.insertOne(c5)
        conversationCollection.insertOne(c6)
        conversationCollection.insertOne(c7)
        conversationCollection.insertOne(c8)
        conversationCollection.insertOne(c9)
        conversationCollection.insertOne(c10)

        val conversations1 = ArrayList<ConversationID>()
        val conversations2 = ArrayList<ConversationID>()
        val conversations3 = ArrayList<ConversationID>()
        val conversations4 = ArrayList<ConversationID>()
        val conversations5 = ArrayList<ConversationID>()
        val conversations6 = ArrayList<ConversationID>()
        val conversations7 = ArrayList<ConversationID>()
        val conversations8 = ArrayList<ConversationID>()
        val conversations9 = ArrayList<ConversationID>()
        val conversations10 = ArrayList<ConversationID>()


        /*val sam = User("Sam1", "sam@mail", "1234", conversations1)*/

        val user = User(sam, samEmail, password, conversations1, ArrayList(), ArrayList())
        val user2 = User(tina, tinaEmail, password, conversations2, ArrayList(), ArrayList())
        val user3 = User(gerry, gerryEmail, password, conversations3, ArrayList(), ArrayList())
        val user4 = User(mohammed, mohammedEmail, password, conversations4, ArrayList(), ArrayList())
        val user5 = User(rickard, rickardEmail, password, conversations5, ArrayList(), ArrayList())
        val user6 = User(rachel, rachelEmail, password, conversations6, ArrayList(), ArrayList())
        val user7 = User(amanda, amandaEmail, password, conversations7, ArrayList(), ArrayList())
        val user8 = User(martin, martinEmail, password, conversations8, ArrayList(), ArrayList())
        val user9 = User(sara, saraEmail, password, conversations9, ArrayList(), ArrayList())
        val user10 = User(bob, bobEmail, password, conversations10, ArrayList(), ArrayList())

        userCollection.insertOne(user)
        userCollection.insertOne(user2)
        userCollection.insertOne(user3)
        userCollection.insertOne(user4)
        userCollection.insertOne(user5)
        userCollection.insertOne(user6)
        userCollection.insertOne(user7)
        userCollection.insertOne(user8)
        userCollection.insertOne(user9)
        userCollection.insertOne(user10)


        addConversationIDToUser(user, ConversationID(c1name, c1ID))
        addConversationIDToUser(user, ConversationID(c2name, c2ID))
        addConversationIDToUser(user, ConversationID(c3name, c3ID))
        addConversationIDToUser(user, ConversationID(c4name, c4ID))
        addConversationIDToUser(user, ConversationID(c5name, c5ID))
        addConversationIDToUser(user, ConversationID(c6name, c6ID))
        addConversationIDToUser(user, ConversationID(c7name, c7ID))
        addConversationIDToUser(user, ConversationID(c8name, c8ID))
        addConversationIDToUser(user, ConversationID(c9name, c9ID))
        addConversationIDToUser(user, ConversationID(c10name, c10ID))

        addConversationIDToUser(user2, ConversationID(c5name, c5ID))
        addConversationIDToUser(user2, ConversationID(c1name, c1ID))

        addConversationIDToUser(user3, ConversationID(c4name, c4ID))
    }

    fun findUserTest(username: String): String? {
        val collection = database.getCollection<User>()
        return collection.findOne("{username:${username.json}}")?.username
    }

}




