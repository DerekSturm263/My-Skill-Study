'use client'

import Skill from '@/lib/types/skill';

import { ViewMode } from "@/lib/types/general";
import { CookiesProvider } from 'react-cookie';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  return (
    <CookiesProvider>
    </CookiesProvider>
  );
}
