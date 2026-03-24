'use client'

import Skill from '@/lib/types/skill';

import { ViewMode } from "@/lib/types/general";
import { CookiesProvider } from 'react-cookie';

export default function Page({ skill, mode }: { skill: Skill, mode: ViewMode }) {
  return (
    <CookiesProvider>
    </CookiesProvider>
  );
}
