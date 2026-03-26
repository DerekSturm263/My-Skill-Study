'use client'

import Skill from '@/lib/types/skill';

import { AutoAwesome, Delete, Edit, Info, Refresh, Save, Share, Visibility } from '@mui/icons-material';
import { DeleteDialog, DetailsDialog, GenerateDialog, PageComponent, ShareDialog, Sidebar, SidebarButton, SuccessDialog } from './general';
import { CookiesProvider } from 'react-cookie';
import { Box, Divider, ListItem, ListItemButton, ListItemText, Snackbar } from '@mui/material';
import { ViewMode } from "@/lib/types/general";
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.quiz);
  const [ currentChapterIndex, setCurrentChapterIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ pagesCompleted, setPagesCompleted ] = useState(value.questions.map(questions => false));
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState<string | null>(null);

  function addChapter() {
    const newChapters = value.questions;
    newChapters.push({
      title: "New Question",
      page: {
        text: {
          text: "",
          requiresCompletion: false
        },
        interactions: []
      }
    });

    setValue({ ... value, questions: newChapters });
  }

  function deleteChapter(index: number) {
    const newChapters = value.questions;
    newChapters.splice(index, 1);

    setValue({ ... value, questions: newChapters });
  }

  return (
    <CookiesProvider>
      <SuccessDialog
        title='Quiz Complete!'
        text={`You are now an expert at ${skill.title}. Feel free to continue practicing or move onto another skill.`}
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
          selectedOption='quiz'
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
              label: "Reset Progress",
              icon: Refresh,
              action: () => { setDialogOpen("resetProgress") }
            },
            {
              label: mode == ViewMode.Edit ? "View" : "Edit",
              icon: mode == ViewMode.Edit ? Visibility : Edit,
              action: async () => {}
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
        >
          {value.questions.map((page, index) => (
            <SidebarButton
              key={index}
              isDisabled={mode == ViewMode.View && (isThinking || (index != 0 && !pagesCompleted[index - 1]))}
              selected={currentChapterIndex == index}
              ogTitle={page.title}
              mode={mode}
              progress={pagesCompleted[index] ? 1 : 0}
              SecondaryIcon={Delete}
              primaryAction={(e) => {
                setCurrentChapterIndex(index);
              }}
              secondaryAction={() => deleteChapter(index)}
            />
          ))}

          <Divider />

          {mode == ViewMode.Edit && (
            <ListItem>
              <ListItemButton
                onClick={(e) => addChapter()}
              >
                <ListItemText
                  sx={{ textAlign: 'center' }}
                >
                  New Question
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </Sidebar>

        {value.questions.map((chapter, index) => (
          (index == currentChapterIndex && (<PageComponent
            key={index}
            element={value.questions[currentChapterIndex].page}
            mode={mode}
            isThinking={isThinking}
            pagesCompleted={[[]] as boolean[][]}
            currentChapterIndex={currentChapterIndex}
            currentPageIndex={0}
            totalPagesInChapter={1}
            setIsThinking={setIsThinking}
            setCurrentPageIndex={setCurrentChapterIndex}
            setSnackbarText={(text: string) => {
              setSnackbarText(text);
              setIsSnackbarOpen(true);
            }}
            setIsPageComplete={(isComplete: boolean) => {
              const newPagesCompleted = pagesCompleted;
              newPagesCompleted[currentChapterIndex] = isComplete;

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
