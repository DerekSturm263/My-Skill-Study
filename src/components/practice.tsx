'use client'

import Skill from '@/lib/types/skill';
import { v4 as uuidv4 } from 'uuid';

import { DeleteDialog, DetailsDialog, GenerateDialog, ShareDialog } from './dialogs';
import { AutoAwesome, Delete, Edit, Info, Save, Share, Visibility } from '@mui/icons-material';
import { Box, ListItem, ListItemButton, ListItemText, Snackbar } from '@mui/material';
import { Sidebar, SidebarButton } from './sidebar';
import { CookiesProvider } from 'react-cookie';
import { PageComponent } from './general';
import { defaultValue } from './text';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';
import { save } from '@/lib/miscellaneous/database';

export default function Page({ skill, id, mode }: { skill: Skill, id: string, mode: ViewMode }) {
  const [ value, setValue ] = useState(skill.practice);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState<string | null>(null);

  function addChapter() {
    const newChapters = value.subSkills;
    newChapters.push({
      title: "New Sub-Skill",
      page: {
        text: defaultValue,
        elements: [],
        id: uuidv4(),
        isComplete: true
      },
      id: uuidv4()
    });

    setValue({ ... value, subSkills: newChapters });
  }

  function deleteChapter(index: number) {
    const newChapters = value.subSkills;
    newChapters.splice(index, 1);

    setValue({ ... value, subSkills: newChapters });
  }

  return (
    <CookiesProvider>
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
          selectedOption='practice'
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
              action: mode == ViewMode.Edit ? "./practice?mode=view" : "./practice?mode=edit",
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
            setCurrentIndex(value.subSkills.length - 1);
          }}
        >
          {value.subSkills.map((subSkill, index) => (
            <SidebarButton
              key={subSkill.id}
              isDisabled={mode == ViewMode.View && isThinking}
              selected={currentIndex == index}
              ogTitle={subSkill.title}
              mode={mode}
              progress={subSkill.page.isComplete ? 1 : 0}
              SecondaryIcon={Delete}
              primaryAction={(e) => {
                setCurrentIndex(index);
              }}
              secondaryAction={() => deleteChapter(index)}
            />
          ))}

          {mode == ViewMode.Edit && (
            <ListItem>
              <ListItemButton
                onClick={(e) => addChapter()}
              >
                <ListItemText
                  sx={{ textAlign: 'center' }}
                >
                  New Sub-Skill
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </Sidebar>

        {value.subSkills.map((chapter, index) => (
          (index == currentIndex && (
            <PageComponent
              key={chapter.id}
              page={chapter.page}
              mode={mode}
              isThinking={isThinking}
              pagesCompleted={[] as boolean[]}
              currentIndex={{ chapter: currentIndex, page: 0 }}
              totalPagesInChapter={1}
              setIsThinking={setIsThinking}
              setCurrentPageIndex={setCurrentIndex}
              setSnackbarText={(text: string) => {
                setSnackbarText(text);
                setIsSnackbarOpen(true);
              }}
              setIsPageComplete={(isComplete: boolean) => {
                value.subSkills[index].page.isComplete = isComplete;
                setValue(value);
              }}
            />
          )
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
