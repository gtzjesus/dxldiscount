import {
  metadata as studioMetadata,
  viewport as studioViewport,
} from 'next-sanity/studio';

export const metadata = {
  ...studioMetadata,
  title: 'DXL Studio',
};

export const viewport = {
  ...studioViewport,
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
