'use client'

import Skill, { PageIndex } from '@/lib/types/skill';
import { v4 as uuidv4 } from 'uuid';

import { DeleteDialog, DetailsDialog, GenerateDialog, ShareDialog, SuccessDialog } from './dialogs';
import { AutoAwesome, Delete, Edit, Info, Refresh, Save, Share, Visibility } from '@mui/icons-material';
import { Sidebar, SidebarButton } from './sidebar';
import { CookiesProvider } from 'react-cookie';
import { Box, Snackbar } from '@mui/material';
import { PageComponent } from './general';
import { defaultValue } from './text';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.learn);
  const [ currentIndex, setCurrentIndex ] = useState<PageIndex>({ chapter: 0, page: 0 });
  const [ isThinking, setIsThinking ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState<string | null>(null);

  function addChapter() {
    const newChapters = value.chapters;
    newChapters.push({
      title: "New Chapter",
      pages: [
        {
          text: defaultValue,
          elements: [],
          id: uuidv4(),
          isComplete: false
        }
      ],
      id: uuidv4()
    });

    setValue({ ... value, chapters: newChapters });
  }

  function deleteChapter(index: number) {
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
            ... (mode == ViewMode.View ? [ {
              label: "Reset Progress",
              icon: Refresh,
              action: () => { setDialogOpen("resetProgress") }
            } ] : [] ),
            {
              label: mode == ViewMode.Edit ? "View" : "Edit",
              icon: mode == ViewMode.Edit ? Visibility : Edit,
              action: mode == ViewMode.Edit ? "./learn?mode=view" : "./learn?mode=edit",
            },
            ... (mode == ViewMode.Edit ? [ {
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
          showAdd={mode == ViewMode.Edit}
          addItem={() => {
            addChapter();
            setCurrentIndex({ chapter: value.chapters.length - 1, page: 0});
          }}
        >
          {value.chapters.map((chapter, index) => {
            return (
              <SidebarButton
                key={chapter.id}
                isDisabled={mode == ViewMode.View && (isThinking || (index != 0 && !value.chapters[index - 1].pages.at(-1)?.isComplete))}
                selected={currentIndex.chapter == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={mode == ViewMode.View ? chapter.pages.filter(item => item.isComplete).length / chapter.pages.length : 1}
                SecondaryIcon={Delete}
                primaryAction={(e) => setCurrentIndex({ chapter: index, page: 0 })}
                secondaryAction={() => deleteChapter(index)}
              />
            );
          })}
        </Sidebar>

        {value.chapters.map((chapter, cIndex) => chapter.pages.map((page, pIndex) => (
          (cIndex == currentIndex.chapter && pIndex == currentIndex.page && (
            <PageComponent
              key={chapter.id}
              page={page}
              mode={mode}
              isThinking={isThinking}
              pagesCompleted={chapter.pages.map(page => page.isComplete)}
              currentIndex={{ chapter: cIndex, page: pIndex }}
              totalPagesInChapter={chapter.pages.length}
              setIsThinking={setIsThinking}
              setCurrentPageIndex={(index: number) => setCurrentIndex({ ... currentIndex, page: index })}
              setSnackbarText={(text: string) => {
                setSnackbarText(text);
                setIsSnackbarOpen(true);
              }}
              setIsPageComplete={(isComplete: boolean) => {
                value.chapters[cIndex].pages[pIndex].isComplete = isComplete;
                setValue(value);
              }}
            />
          ))
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
