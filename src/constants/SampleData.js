export const Samplechats = [
  {
    _id: "1",
    name: "Pallav",
    avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
    groupChat: false,
    members: ["1", "2"],
  },
  {
    _id: "2",
    name: "Aayush",
    avatar: [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/men/1.jpg",
      ,
      "https://randomuser.me/api/portraits/men/1.jpg",
      ,
      "https://randomuser.me/api/portraits/men/1.jpg",
    ],
    groupChat: true,
    members: ["1", "2"],
  },
];

export const SampleUsers = [
  {
    _id: "1",
    name: "Pallav",
    avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
  },
  {
    _id: "2",
    name: "Aayush",
    avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
  },
];
export const SampleNotification = [
  {
    _id: "1",
    sender: {
      name: "Pallav",
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
    },
  },
  {
    _id: "2",
    sender: {
      name: "Aayush",
      avatar: ["https://randomuser.me/api/portraits/men/1.jpg"],
    },
  },
];
export const SampleMessage = [
  {
    attachments: [
      {
        public_id: "asdsad",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "this is the message received",
    _id: "nothing",
    sender: {
      _id: "userId",
      name: "Harshit",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
  {
    attachments: [
      {
        public_id: "asdsad",
        url: "https://static.vecteezy.com/system/resources/thumbnails/041/880/991/small_2x/ai-generated-pic-artistic-depiction-of-sunflowers-under-a-vast-cloudy-sky-photo.jpg",
      },
    ],
    content: "message sent by me hehe",
    _id: "nothing1",
    sender: {
      _id: "234",
      name: "Harshit",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
];
