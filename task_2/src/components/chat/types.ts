export interface ReplyItem {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface ChatPost {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  bookmarked: boolean;
  replies: ReplyItem[];
}

export type ActiveNav = 'Dashboard' | 'Thread' | 'BookMark' | 'Settings';

export interface WorkspaceSettings {
  currentUser: string;
  channelTitle: string;
}
