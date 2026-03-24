'use client'

import Skill from '@/lib/types/skill';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Toolbar } from '@mui/material';
import { Sidebar, SidebarButton } from './general';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';

export default function Page({ skill, mode }: { skill: Skill, mode: ViewMode }) {
  const [ subSkills, setSubSkills ] = useState(skill.practice.subSkills);
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  const [ currentSubSkillIndex, setCurrentSubSkillIndex ] = useState(0);
  const [ hideDialogue, setHideDialogue ] = useState(false);

  return (
    <>
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

        <Stack
          sx={{ flexGrow: 1 }}
        >
          <Toolbar />
          
        </Stack>
      </Box>
    </>
  );
}
