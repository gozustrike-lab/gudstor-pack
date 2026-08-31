'use client';
import { VisualEditing as SanityVisualEditing } from 'next-sanity/visual-editing';
import { useEffect } from 'react';

export default function VisualEditing() {
  useEffect(() => {
    console.log("🟢 VisualEditing component mounted!");
  }, []);
  return <SanityVisualEditing />;
}