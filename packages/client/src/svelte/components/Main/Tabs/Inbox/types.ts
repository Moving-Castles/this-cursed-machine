type Asset {
  _type: string;
  _ref: string;
}

type Attachment {
  filename: string;
  image: Asset;
  _type: string;
}

export type InboxMessage = {
    title: string;
    sender: string
    _updatedAt: string;
    attachment: Attachment[];
    _type: string;
    description: string;
    tutorial: boolean;
    _createdAt: string;
    _rev: string;
    _id: string;
};
