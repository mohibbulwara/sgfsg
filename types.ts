
export interface SlapImpact {
  id: string;
  x: number;
  y: number;
  text: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  avatar: string;
}

export enum SlapCategory {
  SOFT = 'Soft Slap',
  REVENGE = 'Revenge Slap',
  LOVE = 'Love Slap',
  ULTIMATE = 'Ultimate Slap'
}

export interface SlapTypeData {
  type: SlapCategory;
  description: string;
  icon: string;
  color: string;
}
