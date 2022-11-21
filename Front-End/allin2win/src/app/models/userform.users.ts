export class UserForm {
    constructor (
        public _id: string,
        public name: string, 
        public password: string,
        public email: string, 
        public avatar: string,
        public tokens: Number
    ) {}
}