'use client'

import Skill from '@/lib/types/skill';

import { DeleteDialog, DetailsDialog, GenerateDialog, PageComponent, ShareDialog, Sidebar, SidebarButton, SuccessDialog } from './general';
import { AutoAwesome, Delete, Edit, Info, Save, Share, Visibility } from '@mui/icons-material';
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
  const [ pagesCompleted, setPagesCompleted ] = useState(value.chapters.map(chapter => chapter.pages.map(page => false)));
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState<string | null>(null);

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
        title='Lesson Complete!'
        text={`Now that you know about ${skill.title}, try out Practice mode to strengthen your understanding and quiz yourself when you're ready.`}
        isOpen={dialogOpen == "success"}
        setIsOpen={() => setDialogOpen(null)}
      />

      <DetailsDialog
        value={skill}
        isOpen={dialogOpen == "details"}
        setIsOpen={() => setDialogOpen(null)}
      />

      <ShareDialog
        type="skills"
        id={id}
        isOpen={dialogOpen == "share"}
        setIsOpen={() => setDialogOpen(null)}
        setSnackbarText={(text: string) => {
          setSnackbarText(text);
          setIsSnackbarOpen(true);
        }}
      />

      <GenerateDialog
        type="skill"
        id={id}
        isOpen={dialogOpen == "generate"}
        setIsOpen={() => setDialogOpen(null)}
        setSnackbarText={(text: string) => {
          setSnackbarText(text);
          setIsSnackbarOpen(true);
        }}
      />

      <DeleteDialog
        type="skill"
        id={id}
        isOpen={dialogOpen == "delete"}
        setIsOpen={() => setDialogOpen(null)}
        setSnackbarText={(text: string) => {
          setSnackbarText(text);
          setIsSnackbarOpen(true);
        }}
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
              action: () => { setDialogOpen("details") }
            },
            {
              label: "Share",
              icon: Share,
              action: () => { setDialogOpen("share") }
            },
            {
              label: mode == ViewMode.Edit ? "View" : "Edit",
              icon: mode == ViewMode.Edit ? Visibility : Edit,
              action: async () => {}
            },
            ...( mode == ViewMode.Edit ? [ {
              label: "Generate",
              icon: AutoAwesome,
              action: () => { setDialogOpen("generate") }
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
              action: () => { setDialogOpen("delete") }
            } ] : [])
          ]}
        >
          {value.chapters.map((chapter, index) => {
            return (
              <SidebarButton
                key={index}
                isDisabled={mode == ViewMode.View && (isThinking || (index != 0 && !pagesCompleted[index - 1][pagesCompleted[index - 1].length - 1]))}
                selected={currentChapterIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={pagesCompleted[index].filter(item => item).length / pagesCompleted[index].length}
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
              fullWidth
            >
              New Chapter
            </Button>
          )}
        </Sidebar>

        {value.chapters.map((chapter, cIndex) => chapter.pages.map((page, pIndex) => (
          (cIndex == currentChapterIndex && pIndex == currentPageIndex && <PageComponent
            key={`${cIndex},${pIndex}`}
            element={page}
            mode={mode}
            isThinking={isThinking}
            pagesCompleted={pagesCompleted}
            currentChapterIndex={cIndex}
            currentPageIndex={pIndex}
            totalPagesInChapter={chapter.pages.length}
            setIsThinking={setIsThinking}
            setCurrentPageIndex={setCurrentPageIndex}
            setSnackbarText={(text: string) => {
              setSnackbarText(text);
              setIsSnackbarOpen(true);
            }}
            setIsPageComplete={(isComplete: boolean) => {
              const newPagesCompleted = pagesCompleted;
              newPagesCompleted[cIndex][pIndex] = isComplete;

              setPagesCompleted(newPagesCompleted);
            }}
          />)
        )))}

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
