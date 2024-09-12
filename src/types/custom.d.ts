declare module '@contentful/rich-text-react-renderer' {
  import { Document } from '@contentful/rich-text-types';
  import { ReactNode } from 'react';

  export function documentToReactComponents(
    document: Document,
    options?: any
  ): ReactNode;
}
