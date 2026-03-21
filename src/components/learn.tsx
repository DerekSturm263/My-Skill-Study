import speakText from '@/lib/tts/functions';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, Toolbar } from '@mui/material';
import { Header, Interaction, Sidebar, SidebarButton, Text } from './general';
import { ComponentMode, ElementID, Skill } from '@/lib/types';
import { useCookies } from 'react-cookie';
import { useState } from 'react';

import * as helpers from '../lib/helpers';

export default function Content({ slug, skill, mode, apiKey, hideLogo }: { slug: string, skill: Skill, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  const originalTexts = skill.learn.chapters.map((chapter) => chapter.elements.map((element) => element.text)).flat();

  const [ chapters, setChapters ] = useState(skill.learn.chapters);
  const [ currentElement, setCurrentElement ] = useState({ learn: skill.learn, chapterIndex: 0, elementIndex: 0, keys: [ apiKey ] } as ElementID);
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  const [ elementsCompleted, setElementsCompleted ] = useState(Array<boolean>(skill.learn.chapters.reduce((sum, chapter) => sum + chapter.elements.length, 0)).fill(mode != ComponentMode.View));
  const [ texts, setTexts ] = useState(originalTexts);
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isThinking, setIsThinking ] = useState(false);
  const [ cookies, setCookie ] = useCookies(['autoReadAloud']);
  const [ hideDialogue, setHideDialogue ] = useState(false);

  function setText(value: string) {
    const newTexts = texts;
    newTexts[helpers.getAbsoluteIndex(currentElement)] = value;
    setTexts(newTexts);
    
    if (cookies.autoReadAloud)
      readAloud();
  }

  function setIsThinkingSmart(isThinking: boolean) {
    setIsThinking(isThinking);
    setIsNavigationEnabled(!isThinking);
  }

  async function readAloud() {
    const request = {
      input: { text: texts[helpers.getAbsoluteIndex(currentElement)] },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    };

    const stream = await speakText();

    stream.on('data', (response) => { console.log(response) });
    stream.on('error', (err) => { throw(err) });
    stream.on('end', () => { });
    stream.write(request);
    stream.end();
  }

  async function toggleAutoReadAloud() {
    setCookie('autoReadAloud', !cookies.autoReadAloud, { path: '/' });
  }

  async function reset() {
    setText(originalTexts[helpers.getAbsoluteIndex(currentElement)]);
  }

  function complete(isComplete: boolean) {
    if (mode == ComponentMode.View && !elementsCompleted[helpers.getAbsoluteIndex(currentElement)]) {
      setSnackbarText("Good job! Click the next page to continue");
      setIsSnackbarOpen(true);
    }

    const newElementsCompleted = elementsCompleted;
    newElementsCompleted[helpers.getAbsoluteIndex(currentElement)] = isComplete;
    setElementsCompleted(newElementsCompleted);
  }

  function addChapter() {
    const newChapters = chapters;
    newChapters.push();

    setChapters(newChapters);
  }

  function removeChapter(index: number) {
    const newChapters = chapters;
    newChapters.splice(index, 1);

    setChapters(newChapters);
  }

  return (
    <>
      <Dialog
        open={!hideDialogue && mode == ComponentMode.View && elementsCompleted.filter(element => element).length == elementsCompleted.length}
        onClose={(e) => setHideDialogue(true)}
      >
        <DialogTitle>
          Lesson Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {"Good job on completing this lesson!"}
          </DialogContentText>
          
          <DialogContentText>
            {"Next up: Practice this skill to achieve a higher understanding."}
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

      <Header
        slug={slug}
        mode={mode as ComponentMode}
        type="Learn"
        progress={elementsCompleted.filter((element) => element).length / elementsCompleted.length}
        showProgress={true}
        hideLogo={hideLogo}
        value={skill}
        showSave={false}
        linkType="skills"
      />

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Chapters"
        >
          {chapters.map((chapter, index) => {
            const chapterFirstElement = { learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ apiKey ] };

            return (
              <SidebarButton
                key={index}
                isDisabled={!isNavigationEnabled || (index != 0 && !elementsCompleted[helpers.getAbsoluteIndex(chapterFirstElement) - 1])}
                selected={currentElement.chapterIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={elementsCompleted.reduce((sum, element, index) => sum += element && (index >= helpers.getAbsoluteIndex(chapterFirstElement) && index < helpers.getAbsoluteIndex(chapterFirstElement) + chapter.elements.length) ? 1 : 0, 0) / chapter.elements.length}
                onClick={(e) => {
                  setCurrentElement(chapterFirstElement);
                }}
              />
            );
          })}

          {mode == ComponentMode.Edit && (
            <Button
              variant="contained"
              onClick={(e) => addChapter()}
            >
              New Chapter
            </Button>
          )}
        </Sidebar>

        <Stack
          sx={{ flexGrow: 1 }}
        >
          <Toolbar />

          <Interaction
            elementID={currentElement}
            isDisabled={mode == ComponentMode.View && elementsCompleted[helpers.getAbsoluteIndex(currentElement)]}
            mode={mode}
            originalText={originalTexts[helpers.getAbsoluteIndex(currentElement)]}
            setText={setText}
            setIsThinking={setIsThinkingSmart}
            setComplete={complete}
          />

          {/*chapters.map((chapter, cIndex) => chapter.elements.map((element, eIndex) => {
            const elementID = { learn: learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ apiKey ] };

            return (
              <Box
                sx={{ display: cIndex == currentChapter && eIndex == currentElement ? 'block' : 'none' }}
                key={helpers.getAbsoluteIndex(elementID)}
              >
                <Interaction
                  elementID={elementID}
                  isDisabled={!interactionsEnabled[helpers.getAbsoluteIndex(elementID)]}
                  setText={setText}
                  mode={mode}
                />
              </Box>
            );
          }))*/}
      
          <Text
            elementID={currentElement}
            text={texts[helpers.getAbsoluteIndex(currentElement)]}
            mode={mode}
            isThinking={isThinking}
            setText={setText}
            setIsThinking={setIsThinkingSmart}
            readAloud={readAloud}
            toggleAutoReadAloud={toggleAutoReadAloud}
            reset={reset}
            isNavigationEnabled={isNavigationEnabled}
            elementsCompleted={elementsCompleted}
            setCurrentElement={setCurrentElement}
            doReadAloud={cookies.autoReadAloud}
            deleteElement={() => skill.learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex, 1)}
            insertElementBefore={() => skill.learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex + 1, 0, { type: "shortAnswer", text: "", value: {} })}
            insertElementAfter={() => skill.learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex, 0, { type: "shortAnswer", text: "", value: {} })}
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
        </Stack>
      </Box>
    </>
  );
}
