import { faker, simpleFaker } from '@faker-js/faker';
import { Chat } from '../models/chat.js';
import { User } from '../models/user.js';
import { Message } from '../models/message.js';

const createSingleChats = async (numChats) => {
    try {
        const user = await User.find().select('_id');

        const chatsPromise = [];

        for (let i = 0; i < user.length; i++) {
            for (let j = i + 1; j < user.length; j++) {
                chatsPromise.push(
                    Chat.create({
                        name: faker.lorem.words(2),
                        members: [user[i]._id, user[j]]
                    })
                )
            }
        }

        await Promise.all(chatsPromise);

        console.log("Chats created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

const createGroupChats = async (numChats) => {
    try {
        const user = await User.find().select('_id');

        const chatsPromise = [];

        for (let i = 0; i < numChats; i++) {

            const numMembers = simpleFaker.number.int({ min: 3, max: user.length });

            const members = [];

            for (let j = 0; j < numMembers; j++) {


                const randomIndex = Math.floor(Math.random() * user.length);

                const randomUser = user[randomIndex];

                if (!members.includes(randomUser)) {
                    members.push(randomUser);
                }

            }

            const chat = Chat.create({
                name: faker.lorem.words(1),
                groupChat: true,
                members,
                creators: members[0]
            });

        }

        await Promise.all(chatsPromise);

        console.log("Chats created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}


const createMessages = async (numMessages) => {
    try {
        const users = await User.find().select('_id');
        const chats = await Chat.find().select('_id');

        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomChat = chats[Math.floor(Math.random() * chats.length)];

            messagesPromise.push(
                Message.create({
                    chat: randomChat,
                    sender: randomUser,
                    content: faker.lorem.sentence(5)
                })
            )
        }
        await Promise.all(messagesPromise);
        console.log("Messages created successfully");
        process.exit();
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
}

const createMessagesInAChat = async (chatId, numMessages) => {
    try {

        const user = await User.find().select('_id');

        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUser = user[Math.floor(Math.random() * user.length)];

            messagesPromise.push(
                Message.create({
                    chat: chatId,
                    sender: randomUser,
                    content: faker.lorem.sentence()
                })
            )
        }

        await Promise.all(messagesPromise);
        console.log("Messages created successfully");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit();
    }

}

export {
    createGroupChats,
    createMessages,
    createMessagesInAChat, createSingleChats
};
