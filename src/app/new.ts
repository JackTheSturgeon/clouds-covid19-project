import { Reference } from "@angular/compiler/src/render3/r3_ast";
import { DocumentReference } from "@angular/fire/firestore";
import { User } from "./user";
import { ApidbService } from './services/apidb.service';

export class New{
    date: any;
    description: string;
    country: string;
    author_uid: string;
    author_email: string;
    author_displayName: string;

    constructor(
        date: Date,
        description: string,
        country: string,
        author_uid:string,
        author_email: string,
        author_displayName: string){
            this.date = date;
            this.description = description;
            this.country = country;
            this.author_uid=author_uid;
            this.author_email = author_email;
            this.author_displayName = author_displayName;
        }
}
