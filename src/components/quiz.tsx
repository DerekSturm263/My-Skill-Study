'use client'

import Skill from '@/lib/types/skill';

import { AutoAwesome, Delete, Edit, Info, Save, Share, Visibility } from '@mui/icons-material';
import { DeleteDialog, DetailsDialog, GenerateDialog, PageComponent, ShareDialog, Sidebar, SidebarButton, SuccessDialog } from './general';
import { CookiesProvider } from 'react-cookie';
import { Box, Snackbar } from '@mui/material';
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

  return (
    <CookiesProvider>
      <SuccessDialog
        title=''
        text=''
        isOpen={dialogOpen == "success"}
        setIsOpen={() => setDialogOpen(null)}
      />

      <DetailsDialog
        value={skill}
        isOpen={dialogOpen == "details"}
        setIsOpen={() => setDialogOpen(null)}
      />

      <ShareDialog
        type="skill"
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
          {value.questions.map((page, index) => (
            <SidebarButton
              isDisabled={isThinking || (index != 0 && !pagesCompleted[index - 1])}
              selected={currentChapterIndex == index}
              key={index}
              ogTitle={page.title}
              mode={mode}
              progress={pagesCompleted[index] ? 1 : 0}
              onClick={(e) => {
                setCurrentChapterIndex(index);
              }}
            />
          ))}
        </Sidebar>

        <PageComponent
          element={value.questions[currentChapterIndex].page}
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
