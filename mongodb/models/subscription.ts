import { ObjectId } from "mongodb";

export class Subscription {
  constructor(
    public created: Date,
    public answererAddress: string,
    public subscriberAddress: string,
    public subscriberEmail: string,
    public _id?: ObjectId
  ) {}
}
