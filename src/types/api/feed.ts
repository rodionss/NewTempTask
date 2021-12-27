import { FeedItem, User } from '@app-types/challenge'

export type FeedResponse = {
  feed: FeedItem[]
} & Pagination

export type ReactionsResponse = {
  users: User[]
} & Pagination

export type Pagination = {
  has_more: boolean
  page: number
}
