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
  const [ currentChapterIndex, setCurrentChapterIndex ] = useState(0);
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ pagesCompleted, setPagesCompleted ] = useState([[]] as boolean[][]);
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
          selectedOption='learn'
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
                isDisabled={isThinking || (index != 0 && !pagesCompleted[currentPageIndex - 1])}
                selected={currentChapterIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={pagesCompleted[currentChapterIndex].filter(item => item).length / pagesCompleted[currentChapterIndex].length}
                onClick={(e) => {
                  setCurrentChapterIndex(index);
                  setCurrentPageIndex(0);
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
          element={value.chapters[currentChapterIndex].pages[currentPageIndex]}
          mode={mode}
          isThinking={isThinking}
          elementsCompleted={pagesCompleted}
          currentElementIndex={currentPageIndex}
          currentPageIndex={currentChapterIndex}
          totalElementsInPage={value.chapters[currentChapterIndex].pages.length}
          setIsThinking={setIsThinking}
          setCurrentElementIndex={setCurrentPageIndex}
          setSnackbarText={(text: string) => {
            setSnackbarText(text);
            setIsSnackbarOpen(true);
          }}
          setIsElementComplete={(isComplete: boolean) => {
            const newElementsCompleted = pagesCompleted;
            newElementsCompleted[currentChapterIndex][currentPageIndex] = isComplete;

            setPagesCompleted(newElementsCompleted);
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
