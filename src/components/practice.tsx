'use client'

import Skill from '@/lib/types/skill';

import { AutoAwesome, Delete, Edit, Info, Save, Share } from '@mui/icons-material';
import { PageComponent, Sidebar, SidebarButton, SuccessDialog } from './general';
import { CookiesProvider } from 'react-cookie';
import { Box, Snackbar } from '@mui/material';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.practice);
  const [ currentChapterIndex, setCurrentChapterIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ pagesCompleted, setPagesCompleted ] = useState(value.subSkills.map(subSkill => false));
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
              tooltip: "Switch to learn mode",
              link: "./learn",
              id: "learn"
            },
            {
              label: "Practice",
              tooltip: "Switch to practice mode",
              link: "./practice",
              id: "practice"
            },
            {
              label: "Quiz",
              tooltip: "Switch to quiz mode",
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
              label: "Edit",
              icon: Edit,
              action: async () => {}
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
              selected={currentChapterIndex == index}
              key={index}
              ogTitle={subSkill.title}
              mode={mode}
              progress={pagesCompleted[index] ? 1 : 0}
              onClick={(e) => {
                setCurrentChapterIndex(index);
              }}
            />
          ))}
        </Sidebar>

        <PageComponent
          element={value.subSkills[currentChapterIndex].page}
          mode={mode}
          isThinking={isThinking}
          elementsCompleted={[[]] as boolean[][]}
          currentPageIndex={currentChapterIndex}
          currentElementIndex={0}
          totalElementsInPage={1}
          setIsThinking={setIsThinking}
          setCurrentElementIndex={setCurrentChapterIndex}
          setSnackbarText={(text: string) => {
            setSnackbarText(text);
            setIsSnackbarOpen(true);
          }}
          setIsElementComplete={(isComplete: boolean) => {
            const newPagesCompleted = pagesCompleted;
            newPagesCompleted[currentChapterIndex] = isComplete;

            setPagesCompleted(newPagesCompleted);
          }}
        />

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
