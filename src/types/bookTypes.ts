import Iuser from "./userTypes";

// author is interface of user so we give relationship between book author and author field in book

interface Ibook {
    _id: string;
    title: string;
    author: Iuser;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}

export default Ibook;