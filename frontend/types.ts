export type TimeSlot = 'now' | 'lunch' | 'night';

export interface IkitaiFriend {
  userId: string;
  userName: string;
  userIconUrl: string;
  timeSlot: TimeSlot;
  municipality: string;
}