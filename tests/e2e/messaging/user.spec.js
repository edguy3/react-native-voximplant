const should = require('should');
const { TEST_LOGIN,
        TEST_PASSWORD,
        TEST_USER_2,
        TEST_USER_3 } = TestHelpers.credentials;

describe('user', () => {
    let client = null;
    let messenger = null;

    before(async() => {
        await device.reloadReactNative();

        client = Voximplant.getInstance();
        await client.connect();
        await client.login(TEST_LOGIN, TEST_PASSWORD);
        messenger = Voximplant.getMessenger();
    });

    after(async() => {
       await client.disconnect();
    });

    it('get me', () => {
        messenger.should.be.not.null();
        const me = messenger.getMe();
        TEST_LOGIN.should.containEql(me);
    });

    it('get user', (done) => {
        messenger.should.be.not.null();
        messenger.on(Voximplant.Messaging.MessengerEventTypes.GetUser, (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.GetUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.getUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.equal(userEvent.user.userId, TEST_USER_2);
            should.exist(userEvent.user.conversationsList);
            done();
        });
        messenger.getUser(TEST_USER_2);
    });

    it('set status', (done) => {
        messenger.should.be.not.null();
        messenger.on(Voximplant.Messaging.MessengerEventTypes.SetStatus, (statusEvent) => {
            console.log(JSON.stringify(statusEvent));
            should.exist(statusEvent.messengerEventType);
            should.equal(statusEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.SetStatus);
            should.exist(statusEvent.messengerAction);
            should.equal(statusEvent.messengerAction, Voximplant.Messaging.MessengerAction.setStatus);
            should.exist(statusEvent.userId);
            should.equal(statusEvent.userId, messenger.getMe());
            should.exist(statusEvent.userStatus);
            should.exist(statusEvent.userStatus.online);
            (statusEvent.userStatus.online).should.be.true();
            should.exist(statusEvent.userStatus.timestamp);
            done();
        });
        messenger.setStatus(true);
    });

    it('subscribe to user2 and user3', (done) => {
        messenger.should.be.not.null();
        messenger.on(Voximplant.Messaging.MessengerEventTypes.Subscribe, (subscriptionEvent) => {
            console.log(JSON.stringify(subscriptionEvent));
            should.exist(subscriptionEvent.messengerEventType);
            should.equal(subscriptionEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Subscribe);
            should.exist(subscriptionEvent.messengerAction);
            should.equal(subscriptionEvent.messengerAction, Voximplant.Messaging.MessengerAction.subscribe);
            should.exist(subscriptionEvent.userId);
            should.equal(subscriptionEvent.userId, messenger.getMe());
            should.exist(subscriptionEvent.users);
            //TODO: fix it
            // (subscriptionEvent.users).should.eql([TEST_USER_2, TEST_USER_3]);
            done();
        });
        messenger.subscribe([TEST_USER_2, TEST_USER_3]);
    });

    it('unsubscribe from user2', (done) => {
       messenger.should.not.be.null();
       messenger.on(Voximplant.Messaging.MessengerEventTypes.Unsubscribe, (subscriptionEvent) => {
           console.log(JSON.stringify(subscriptionEvent));
           should.exist(subscriptionEvent.messengerEventType);
           should.equal(subscriptionEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.Unsubscribe);
           should.exist(subscriptionEvent.messengerAction);
           should.equal(subscriptionEvent.messengerAction, Voximplant.Messaging.MessengerAction.unsubscribe);
           should.exist(subscriptionEvent.userId);
           should.equal(subscriptionEvent.userId, messenger.getMe());
           should.exist(subscriptionEvent.users);
           //TODO: fix it
           // (subscriptionEvent.users).should.eql([TEST_USER_3]);
           done();
       });
       messenger.unsubscribe([TEST_USER_2]);
    });

    it('edit user custom data with string', (done) => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : "Test custom data 1",
            testCustomData2 : "Test custom data 2"
        };
        let privateCustomDataTest = {
            testPrivateData: "Test private data",
            testPrivateData2: "Test private data 2"
        };
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.editUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.exist(userEvent.user.customData);
            should.exist(userEvent.user.privateCustomData);
            (userEvent.user.customData).should.eql(customDataTest);
            (userEvent.user.privateCustomData).should.eql(privateCustomDataTest);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.editUser(customDataTest, privateCustomDataTest);
    });

    it('edit user custom data with number', (done) => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : 123,
            testCustomData2 : 456
        };
        let privateCustomDataTest = {
            testPrivateData: 789,
            testPrivateData2: 890
        };
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.editUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.exist(userEvent.user.customData);
            should.exist(userEvent.user.privateCustomData);
            (userEvent.user.customData).should.eql(customDataTest);
            (userEvent.user.privateCustomData).should.eql(privateCustomDataTest);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.editUser(customDataTest, privateCustomDataTest);
    });

    it('edit user custom data with boolean', (done) => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : true,
            testCustomData2 : false
        };
        let privateCustomDataTest = {
            testPrivateData: false,
            testPrivateData2: true
        };
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.editUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.exist(userEvent.user.customData);
            should.exist(userEvent.user.privateCustomData);
            (userEvent.user.customData).should.eql(customDataTest);
            (userEvent.user.privateCustomData).should.eql(privateCustomDataTest);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.editUser(customDataTest, privateCustomDataTest);
    });

    it('edit user custom data with array', (done) => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : ["data 1", "data 2"],
            testCustomData2 : [123, 456]
        };
        let privateCustomDataTest = {
            testPrivateData: [true, true],
            testPrivateData2: []
        };
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.editUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.exist(userEvent.user.customData);
            should.exist(userEvent.user.privateCustomData);
            (userEvent.user.customData).should.eql(customDataTest);
            (userEvent.user.privateCustomData).should.eql(privateCustomDataTest);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.editUser(customDataTest, privateCustomDataTest);
    });

    it('edit user custom data with map', (done) => {
        messenger.should.not.be.null();
        let customDataTest = {
            testCustomData : { data : "data"},
            testCustomData2 : { key : 12344}
        };
        let privateCustomDataTest = {
            testPrivateData: {data : true },
            testPrivateData2: { key : false }
        };
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.editUser);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            should.exist(userEvent.user.customData);
            should.exist(userEvent.user.privateCustomData);
            (userEvent.user.customData).should.eql(customDataTest);
            (userEvent.user.privateCustomData).should.eql(privateCustomDataTest);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.editUser(customDataTest, privateCustomDataTest);
    });

    it('manage messenger notifications', (done) => {
        messenger.should.not.be.null();
        let notifications = [
            Voximplant.Messaging.MessengerNotifications.SendMessage,
            Voximplant.Messaging.MessengerNotifications.EditMessage
        ];
        let userEditEvent = (userEvent) => {
            console.log(JSON.stringify(userEvent));
            should.exist(userEvent.messengerEventType);
            should.equal(userEvent.messengerEventType, Voximplant.Messaging.MessengerEventTypes.EditUser);
            should.exist(userEvent.messengerAction);
            should.equal(userEvent.messengerAction, Voximplant.Messaging.MessengerAction.manageNotifications);
            should.exist(userEvent.userId);
            should.equal(userEvent.userId, messenger.getMe());
            should.exist(userEvent.user);
            (userEvent.user.messengerNotifications).should.eql(notifications);

            messenger.off(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
            done();
        };
        messenger.on(Voximplant.Messaging.MessengerEventTypes.EditUser, userEditEvent);
        messenger.managePushNotifications(notifications);
    });


});