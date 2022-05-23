export interface IInboxMessage {
    id?: string;
    message?: string;
    sendDate?: Date;
    inboxConversationId?: string;
    fromId?: string;
    fromName?: string;
    userPhoto?: string;
    fileUrl?: string;
}

export class InboxMessageModel implements IInboxMessage{

    constructor(
        public id?: string,
        public message?:string,
        public sendDate?: Date,
        public inboxConversationId?: string,
        public fromId?: string,
        public fromName?: string,
        public userPhoto?: string,
        public fileUrl?: string  
    )
    {

    }
}