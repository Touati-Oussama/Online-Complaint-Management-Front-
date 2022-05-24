export interface IInboxParticipant {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    photo?: string;
    role?: string
    username?: string;
    connected?: boolean;
}

export class InboxParticipantModel implements IInboxParticipant{
    constructor(
        public id?: string,
        public name?: string,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public photo?: string,
        public role?: string,
        public username?: string,
        public connected?: boolean
    ){

    }
}