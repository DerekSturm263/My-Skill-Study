'use client'

import Skill from '@/lib/types/skill';

import { AutoAwesome, Delete, Info, Save, Share } from '@mui/icons-material';
import { Sidebar, SidebarButton, SuccessDialog } from './general';
import { CookiesProvider } from 'react-cookie';
import { Box, Snackbar } from '@mui/material';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.practice);
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const [ currentElementIndex, setCurrentElementIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ elementsCompleted, setElementsCompleted ] = useState([[]] as boolean[][]);
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);

  return (
    <CookiesProvider>
      <SuccessDialog
        title=''
        text=''
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Sub-Skills"
          options={[
            {
              label: "Learn",
              link: "./learn",
              id: "learn"
            },
            {
              label: "Practice",
              link: "./practice",
              id: "practice"
            },
            {
              label: "Quiz",
              link: "./quiz",
              id: "quiz"
            }
          ]}
          selectedOption='practice'
          actions={[
            {
              label: "Details",
              icon: Info,
              action: () => {}
            },
            {
              label: "Share",
              icon: Share,
              action: () => {}
            },
            {
              label: "Generate",
              icon: AutoAwesome,
              action: () => {}
            },
            {
              label: "Save",
              icon: Save,
              action: async () => {
                await save("skills", id, skill);
          
                setSnackbarText("Saved");
                setIsSnackbarOpen(true);
              }
            },
            {
              label: "Delete",
              icon: Delete,
              action: () => {}
            }
          ]}
        >
          {value.subSkills.map((subSkill, index) => (
            <SidebarButton
              isDisabled={isThinking}
              selected={currentPageIndex == index}
              key={index}
              ogTitle={subSkill.title}
              mode={mode}
              progress={0}
              onClick={(e) => {
                setCurrentPageIndex(index);
                setCurrentElementIndex(0);
              }}
            />
          ))}
        </Sidebar>
        
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          autoHideDuration={3000}
          open={isSnackbarOpen}
          message={snackbarText}
          onClose={(e, reason?) => {
            if (reason === 'clickaway')
              return;
        
            setIsSnackbarOpen(false);
          }}
        />
      </Box>
    </CookiesProvider>
  );
}
