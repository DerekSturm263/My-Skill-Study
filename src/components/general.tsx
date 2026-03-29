'use client'

import './style.css';

import ReorderList, { ReorderIcon } from 'react-reorder-list';
import TextComponent from '@/components/text'; 
import { v4 as uuidv4 } from 'uuid';

import { IconButton, Typography, Stack, Toolbar, Tooltip, ToggleButton } from '@mui/material';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { ElementPackage, Element, elementMap } from '../lib/types/element';
import { NewElementDialog, SettingsDialog } from './dialogs';
import { useSearchParams } from 'next/navigation';
import { Add, Settings } from '@mui/icons-material';
import { Verification } from '@/lib/ai/types';
import { ViewMode } from '../lib/types/general';
import { Page, PageIndex } from '@/lib/types/skill';

export function PageComponent({ page, mode, isThinking, pagesCompleted, currentIndex, totalPagesInChapter, setIsThinking, setCurrentPageIndex, setSnackbarText, setIsPageComplete: setIsElementComplete }: { page: Page, mode: ViewMode, isThinking: boolean, pagesCompleted: boolean[], currentIndex: PageIndex, totalPagesInChapter: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentPageIndex: (index: number) => void, setSnackbarText: (text: string) => void, setIsPageComplete: (isComplete: boolean) => void }) {
  const searchParams = useSearchParams();
  const hideHeader = searchParams.get('hideHeader') === 'true';

  const [ value, setValue ] = useState(page);
  const [ isNewOpen, setIsNewOpen ] = useState(false);

  useEffect(() => {
    if (page.elements.every(element => !element.value.requiresCompletion)) {
      setIsComplete(true, false);
    }
  }, []);
    
  function setIsComplete(isComplete: boolean, showSnackbar: boolean) {
    setIsElementComplete(isComplete);

    if (showSnackbar && mode == ViewMode.View) {
      setSnackbarText("Good job! Click the next page to continue");
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
    >
      {!hideHeader && <Toolbar />}

      <Stack
        direction="row"
        sx={{ flexGrow: 1 }}
      >
        <ReorderList
          useOnlyIconToDrag={true}
          onPositionChange={(e) => {
            const newElements = value.elements;
            const [ oldElement ] = newElements.splice(e.start, 1);
            newElements.splice(e.end, 0, oldElement);

            setValue({ ... value, elements: newElements });
          }}
          props={{ className: "reorderableList", style: {
            display: "flex", flexDirection: "row", gap: mode == ViewMode.Edit ? 8 : 0, flexGrow: 1, padding: mode == ViewMode.Edit ? "8px" : "0px"
          }}}
        >
          {page.elements.map((element, index) => (
            <ElementComponent
              key={element.id}
              text={page.text.text}
              originalValue={element.value}
              type={element.type}
              mode={mode}
              setText={(text) => setValue({ ... value, text: { text: text, requiresCompletion: false } })}
              deleteElement={() => {
                const elements = page.elements;
                elements.splice(index, 1);

                setValue({ ... value, elements: elements });
              }}
              setIsThinking={setIsThinking}
              setIsComplete={setIsComplete}
            />
          ))}
        </ReorderList>

        {mode == ViewMode.Edit && page.elements.length == 0 && (
          <Typography
            sx={{ margin: "auto", flexGrow: 1, color: (theme) => theme.palette.text.secondary }}
          >
            This page has no elements. The text below will take up the whole page in View mode. To add an element, click the Add button on the right.
          </Typography>
        )}

        {mode == ViewMode.Edit && value.elements.length <= 4 && (
          <ToggleButton
            onClick={() => setIsNewOpen(true)}
            sx={{ flexGrow: 0, flexBasis: "80px", backgroundColor: (theme) => theme.palette.grey[900], marginTop: '8px', marginBottom: '8px', marginRight: '8px' }}
            value=""
          >
            <Add/>
          </ToggleButton>
        )}
      </Stack>

      <TextComponent
        originalValue={page.text.text}
        currentValue={value.text.text}
        currentPageIndex={currentIndex.page}
        totalPagesInChapter={totalPagesInChapter}
        isThinking={isThinking}
        pagesCompleted={pagesCompleted}
        mode={mode}
        setCurrentValue={(text) => setValue({ ... value, text: { text: text,  requiresCompletion: false } })}
        setIsThinking={setIsThinking}
        setCurrentPageIndex={setCurrentPageIndex}
      />

      <NewElementDialog
        isOpen={isNewOpen}
        setIsOpen={setIsNewOpen}
        createElement={(type: string) => {
          const newElements = page.elements;
          newElements.push({
            type: type,
            value: (elementMap[type] as ElementPackage<Element>).defaultValue,
            id: uuidv4()
          });

          setValue({ ... value, elements: newElements });
        }}
      />
    </Stack>
  );
}

export function ElementComponent({ text, originalValue, type, mode, setText, deleteElement, setIsThinking, setIsComplete }: { text: string, originalValue: Element, type: string, mode: ViewMode, setText: (text: string) => void, deleteElement: () => void, setIsThinking: Dispatch<SetStateAction<boolean>>, setIsComplete: (isComplete: boolean, showSnackbar: boolean) => void }) {
  const [ value, setValue ] = useState(originalValue);
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);
  const [ isDisabled, setIsDisabled ] = useState(false);

  function reset() {
    setValue((elementMap[type] as ElementPackage<Element>).defaultValue);
  }

  async function evaluateAndReply(promise: Promise<Verification>)  {
    setIsThinking(true);

    const verification = await promise;
    setText(verification.feedback);
    
    setIsThinking(false);

    if (verification.isValid) {
      setIsComplete(true, true);
    }
  }

  const Icon = (elementMap[type] as ElementPackage<Element>).icon;
  const Component = (elementMap[type] as ElementPackage<Element>).Component;

  return (
    <Stack
      sx={{ flexGrow: 1, backgroundColor: (theme) => theme.palette.grey[900] }}
      style={{ height: "100%" }}
      borderRadius={1}
    >
      {mode == ViewMode.Edit && (
        <ReorderIcon
          draggable={true}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", backgroundColor: (theme) => theme.palette.grey[800] }}
            borderRadius={1}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ marginTop: "auto", marginBottom: "auto", marginLeft: "8px" }}
            >
              <Icon />

              <Typography
                sx={{ overflow: "hidden", whiteSpace: "nowrap" }}
              >
                {(elementMap[type] as ElementPackage<Element>).prettyName}
              </Typography>
            </Stack>

            <Tooltip
              title="Edit this element"
            >
              <IconButton
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Stack>
        </ReorderIcon>
      )}

      <Component
        text={text}
        value={value}
        isDisabled={isDisabled || mode == ViewMode.Edit}
        setText={setText}
        evaluateAndReply={evaluateAndReply}
        setValue={setValue}
        setIsDisabled={setIsDisabled}
      />

      <SettingsDialog
        value={value}
        type={type}
        isOpen={isSettingsOpen}
        setValue={setValue}
        setIsOpen={setIsSettingsOpen}
        resetElement={reset}
        deleteElement={deleteElement}
      />
    </Stack>
  );
}
