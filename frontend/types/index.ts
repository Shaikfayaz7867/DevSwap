export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role?: string;
  experience?: string;
  company?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  github?: string;
  portfolio?: string;
  certifications?: string[];
  bio?: string;
  goals?: string;
  onboardingCompleted?: boolean;
  profileCompletion?: number;
  isOnline?: boolean;
};

export type SwipeCandidate = AuthUser & {
  matchScore: number;
};

export type Post = {
  _id: string;
  userId: Pick<AuthUser, '_id' | 'name' | 'profileImage' | 'role' | 'experience'>;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  likes: string[];
  commentsCount: number;
  isBookmarked?: boolean;
  createdAt: string;
};

export type FeedComment = {
  _id: string;
  postId: string;
  userId: Pick<AuthUser, '_id' | 'name' | 'profileImage' | 'role'>;
  parentCommentId?: string | null;
  comment: string;
  createdAt: string;
};

export type Match = {
  _id: string;
  users: string[];
  otherUser: AuthUser;
};

export type Message = {
  _id: string;
  matchId: string;
  sender: Pick<AuthUser, '_id' | 'name' | 'profileImage'>;
  receiver: Pick<AuthUser, '_id' | 'name' | 'profileImage'>;
  message: string;
  createdAt: string;
};

export type NotificationItem = {
  _id: string;
  type: 'match' | 'message' | 'like' | 'comment' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};
