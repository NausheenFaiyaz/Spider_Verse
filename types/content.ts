import type { ImageSourcePropType } from 'react-native';

export type CollectionItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string;
  imageUrl: string;
  fallbackImageUrl?: string;
  localImage?: ImageSourcePropType;
  link?: string;
  linkLabel?: string;
  badge?: string;
};