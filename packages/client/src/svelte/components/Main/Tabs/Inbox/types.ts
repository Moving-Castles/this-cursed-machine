export type InboxMessage = {
    title: string;
    _updatedAt: string;
    attachment: {
        _type: string;
        asset: {
            _type: string;
            _ref: string;
        };
    };
    _type: string;
    description: string;
    tutorial: boolean;
    _createdAt: string;
    _rev: string;
    _id: string;
};
