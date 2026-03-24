'use client'

import Skill from '@/lib/types/skill';

import { PageComponent, Sidebar, SidebarButton, SuccessDialog } from './general';
import { AutoAwesome, Delete, Info, Save, Share } from '@mui/icons-material';
import { Box, Button, Snackbar } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.learn);
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const [ currentElementIndex, setCurrentElementIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ elementsCompleted, setElementsCompleted ] = useState([[]] as boolean[][]);
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);

  function addChapter() {
    const newChapters = value.chapters;
    newChapters.push();

    setValue({ ... value, chapters: newChapters });
  }

  function removeChapter(index: number) {
    const newChapters = value.chapters;
    newChapters.splice(index, 1);

    setValue({ ... value, chapters: newChapters });
  }

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
          label={skill.title}
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
          {value.chapters.map((chapter, index) => {
            return (
              <SidebarButton
                key={index}
                isDisabled={isThinking || (index != 0 && !elementsCompleted[currentElementIndex - 1])}
                selected={currentPageIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={elementsCompleted.reduce((sum, element, index) => sum += element && (index >= currentElementIndex && index < currentElementIndex + chapter.pages.length) ? 1 : 0, 0) / chapter.pages.length}
                onClick={(e) => {
                  setCurrentPageIndex(index);
                  setCurrentElementIndex(0);
                }}
              />
            );
          })}

          {mode == ViewMode.Edit && (
            <Button
              variant="contained"
              onClick={(e) => addChapter()}
            >
              New Chapter
            </Button>
          )}
        </Sidebar>

        <PageComponent
          element={value.chapters[currentPageIndex].pages[currentElementIndex]}
          mode={mode}
          isThinking={isThinking}
          elementsCompleted={elementsCompleted}
          currentElementIndex={currentElementIndex}
          currentPageIndex={currentPageIndex}
          totalElementsInPage={value.chapters[currentPageIndex].pages.length}
          setIsThinking={setIsThinking}
          setCurrentElementIndex={setCurrentElementIndex}
          setSnackbarText={(text: string) => {
            setSnackbarText(text);
            setIsSnackbarOpen(true);
          }}
          setIsElementComplete={(isComplete: boolean) => {
            const newElementsCompleted = elementsCompleted;
            newElementsCompleted[currentPageIndex][currentElementIndex] = isComplete;

            setElementsCompleted(newElementsCompleted);
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
