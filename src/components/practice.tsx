'use client'

import Skill from '@/lib/types/skill';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Sidebar, SidebarButton } from './general';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { CookiesProvider } from 'react-cookie';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ subSkills, setSubSkills ] = useState(skill.practice.subSkills);
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  const [ currentSubSkillIndex, setCurrentSubSkillIndex ] = useState(0);
  const [ hideDialogue, setHideDialogue ] = useState(false);

  return (
    <CookiesProvider>
      <Dialog
        open={!hideDialogue}
        onClose={(e) => setHideDialogue(true)}
      >
        <DialogTitle>
          Practice Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {"Good job on completing this practice!"}
          </DialogContentText>
          
          <DialogContentText>
            {"Next up: Quiz yourself on this skill to check your understanding."}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(e) => setHideDialogue(true)}
          >
            Close
          </Button>

          <Button
            href="./quiz"
          >
            Quiz Skill
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Sub-Skills"
          actions={[]}
        >
          {subSkills.map((subSkill, index) => (
            <SidebarButton
              isDisabled={!isNavigationEnabled}
              selected={currentSubSkillIndex == index}
              key={index}
              ogTitle={subSkill.title}
              mode={mode}
              progress={0}
              onClick={(e) => {
                setCurrentSubSkillIndex(index);
              }}
            />
          ))}
        </Sidebar>
      </Box>
    </CookiesProvider>
  );
}
