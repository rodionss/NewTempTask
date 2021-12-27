export type Media = {
  thumbnail_url: string
  video_url: string
}

export type User = {
  id: number
  name: string
  photo_url: string
  username: string
  user_stats: UserStats
}

export enum Reaction {
  Like = 'like',
  Together = 'together',
  Super = 'super',
  Lol = 'lol',
  Wow = 'wow',
  Cute = 'cute',
}

type ReactionsCount = Record<Reaction, number>

type UserStats = {
  reaction: Reaction
  views_count: number
}

export type FeedItem = {
  completed_at: string
  id: number
  position: number
  reactions_count?: ReactionsCount
  views_count: number
  user_stats?: UserStats
  author?: User
  user: User
  media: Media
}

export type Challenge = {
  id: number
  title: string
  public: boolean
  access_url: string
  user: User
  author: User
  reactions_count: ReactionsCount
}
