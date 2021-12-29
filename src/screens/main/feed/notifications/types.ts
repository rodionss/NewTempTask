import { User } from '@app-types/challenge'

export enum View {
  Digest = 'digest',
  Notifications = 'notifications',
  ActiveGames = 'activeGames',
}

export enum NotificationType {
  FollowingRequest = 'following_regitquest',
  Follower = 'started_follow',
  Invite = 'invited_to_challenge',
  Tag = 'tagged_in_challenge',
  Completions = 'completions_count',
  Reactions = 'reaction_added',
}

export type Challenge = {
  id: number
  media: Media
  title: string
  is_finished: boolean
  user: User
}

export type Media = {
  thumbnail_url: string
}

export type Meta = {
  request_state: string
  challenge: Challenge
  follower: User
  followee: User
  friends: User[]
  count: number
  inviter: User
  followee_id: number
}

export type Notification = {
  id: number
  type: NotificationType
  updated_at: string
  meta: Meta
}

export type NotificationGroup = {
  section: string
  data: Notification[]
}

export type NotificationsResponse = {
  notifications: Notification[]
  has_more: boolean
  page: number
}

export type Pagination = {
  hasMore: boolean
  page: number
}

export enum SectionTitle {
  Day = 'This Day',
  Week = 'This Week',
  Earlier = 'Earlier',
}
