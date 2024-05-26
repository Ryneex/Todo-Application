export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
}

export interface ISession {
    _id: string;
    user: string | IUser;
    expiresAt: Date;
}

export interface ITodo {
    _id: string;
    owner: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}
