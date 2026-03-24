'use client'

import Skill from '@/lib/types/skill';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { ElementComponent, Sidebar, SidebarButton } from './general';
import { ViewMode } from '@/lib/types/general';
import { useState } from 'react';

export default function Page({ skill, mode }: { skill: Skill, mode: ViewMode }) {
  const [ learn, setLearn ] = useState(skill.learn);
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const [ currentElementIndex, setCurrentElementIndex ] = useState(0);
  const [ isThinking, setIsThinking ] = useState(false);
  const [ elementsCompleted, setElementsCompleted ] = useState([[]] as boolean[][]);
  const [ hideDialogue, setHideDialogue ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);

  function addChapter() {
    const newChapters = learn.chapters;
    newChapters.push();

    setLearn({ ... learn, chapters: newChapters });
  }

  function removeChapter(index: number) {
    const newChapters = learn.chapters;
    newChapters.splice(index, 1);

    setLearn({ ... learn, chapters: newChapters });
  }

  return (
    <>
      <Dialog
        open={!hideDialogue && mode == ViewMode.View && elementsCompleted.filter(element => element).length == elementsCompleted.length}
        onClose={(e) => setHideDialogue(true)}
      >
        <DialogTitle>
          Module Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Good job on completing this module!
          </DialogContentText>
          
          <DialogContentText>
            ...
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(e) => setHideDialogue(true)}
          >
            Close
          </Button>

          <Button
            href="./practice"
          >
            Practice Skill
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Chapters"
        >
          {learn.chapters.map((chapter, index) => {
            return (
              <SidebarButton
                key={index}
                isDisabled={isThinking || (index != 0 && !elementsCompleted[currentElementIndex - 1])}
                selected={currentPageIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={elementsCompleted.reduce((sum, element, index) => sum += element && (index >= currentElementIndex && index < currentElementIndex + chapter.elements.length) ? 1 : 0, 0) / chapter.elements.length}
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

        <ElementComponent
          element={learn.chapters[currentPageIndex].elements[currentElementIndex]}
          mode={mode}
          isThinking={isThinking}
          elementsCompleted={elementsCompleted}
          currentElementIndex={currentElementIndex}
          currentPageIndex={currentPageIndex}
          totalElementsInPage={learn.chapters[currentPageIndex].elements.length}
          setIsThinking={setIsThinking}
          setCurrentElementIndex={setCurrentElementIndex}
          setSnackbarText={setSnackbarText}
          setIsSnackbarOpen={setIsSnackbarOpen}
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
            if (reason === 'clickaway') {
              return;
            }

            setIsSnackbarOpen(false);
          }}
        />
      </Box>
    </>
  );
}
