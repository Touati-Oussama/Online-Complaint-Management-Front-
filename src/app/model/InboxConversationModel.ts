import { IInboxMessage } from './IInboxMessage';
import { IInboxParticipant } from './InboxParticipantModel';


export interface IInboxConversation{
    id?: string;
    subject?: string;
    startDate?: Date;
    participants?: IInboxParticipant[];
    lastInBoxMessage?: IInboxMessage;
    lastModifiedDate?: Date;
    seen?: boolean;
}

export class InboxConversationModel implements IInboxConversation{ 
    constructor(
        public id?: string,
        public subject?: string,
        public startDate?: Date,
        public participants?: IInboxParticipant[],
        public lastInBoxMessage?: IInboxMessage,
        public lastModifiedDate?: Date,
        public seen?: boolean,
    ){

    }
}
