'use client'

import './style.css';

import ReorderList, { ReorderIcon } from 'react-reorder-list';
import Files from '@/elements/files/components';
import Drawing from '@/elements/drawing/components';
import Graph from '@/elements/graph/components';
import DAW from '@/elements/daw/components';
import Codespace from '@/elements/codespace/components';
import ThreeDModeling from '@/elements/3d_modeling/elements';
import GameEngine from '@/elements/game_engine/components';
import ShortAnswer from '@/elements/short_answer/components';
import TrueOrFalse from '@/elements/true_or_false/components';
import MultipleChoice from '@/elements/multiple_choice/components';
import Ordering from '@/elements/ordering/components';
import Matching from '@/elements/matching/components';
import Embed from '@/elements/embed/components';
import { v4 as uuidv4 } from 'uuid';

import { IconButton, Typography, Stack, Toolbar, Tooltip, ToggleButton } from '@mui/material';
import { ElementProps, ElementPackageBase, ElementPackage, Element } from '../lib/types/element';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { NewElementDialog, SettingsDialog } from './dialogs';
import { Component as TextComponent } from '@/elements/text/components'; 
import { useSearchParams } from 'next/navigation';
import { Add, Settings } from '@mui/icons-material';
import { Verification } from '@/lib/ai/types';
import { ViewMode } from '../lib/types/general';
import { Page } from '@/lib/types/skill';

export const elementMap: Record<string, ElementPackageBase> = {
  "files": Files,
  "drawing": Drawing,
  "graph": Graph,
  "daw": DAW,
  "codespace": Codespace,
  "3d_modeling": ThreeDModeling,
  "engine": GameEngine,
  "shortAnswer": ShortAnswer,
  "trueOrFalse": TrueOrFalse,
  "multipleChoice": MultipleChoice,
  "ordering": Ordering,
  "matching": Matching,
  "embed": Embed
};

export function PageComponent({ page, mode, isThinking, pagesCompleted, currentChapterIndex, currentPageIndex, totalPagesInChapter, setIsThinking, setCurrentPageIndex: setCurrentElementIndex, setSnackbarText, setIsPageComplete: setIsElementComplete }: { page: Page, mode: ViewMode, isThinking: boolean, pagesCompleted: boolean[][], currentChapterIndex: number, currentPageIndex: number, totalPagesInChapter: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentPageIndex: Dispatch<SetStateAction<number>>, setSnackbarText: (text: string) => void, setIsPageComplete: (isComplete: boolean) => void }) {
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
            display: "flex", flexDirection: "row", gap: mode == ViewMode.Edit ? 8 : 0, flexGrow: 1, padding: mode == ViewMode.Edit ? "8px" : "0px" }
          }}
        >
          {page.elements.map((element, index) => (
            <ElementComponent
              key={element.id}
              thisType={element.type}
              text={page.text.text}
              originalValue={element.value}
              chapterIndex={currentChapterIndex}
              pageIndex={currentPageIndex}
              totalPagesInChapter={totalPagesInChapter}
              isThinking={isThinking}
              pagesCompleted={pagesCompleted}
              mode={mode}
              setText={(text) => setValue({ ... value, text: { text: text, requiresCompletion: false } })}
              evaluateAndReply={async (promise: Promise<Verification>) => {
                setIsThinking(true);

                const verification = await promise;
                setValue({ ... value, text: { text: verification.feedback, requiresCompletion: false } })
    
                setIsThinking(false);

                if (verification.isValid) {
                  setIsComplete(true, true);
                }
              }}
              setCurrentElementIndex={setCurrentElementIndex}
              deleteElement={() => {
                const elements = page.elements;
                elements.splice(index, 1);

                setValue({ ... value, elements: elements });
              }}
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

        {mode == ViewMode.Edit && (
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
        text={value.text.text}
        originalValue={page.text}
        chapterIndex={currentChapterIndex}
        pageIndex={currentPageIndex}
        totalPagesInChapter={totalPagesInChapter}
        isThinking={isThinking}
        pagesCompleted={pagesCompleted}
        mode={mode}
        setText={(text) => setValue({ ... value, text: { text: text,  requiresCompletion: false } })}
        evaluateAndReply={async (promise: Promise<Verification>) => {
          setIsThinking(true);

          const verification = await promise;
          setValue({ ... value, text: { text: verification.feedback,  requiresCompletion: false } })
    
          setIsThinking(false);
        }}
        setCurrentElementIndex={setCurrentElementIndex}
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

export function ElementComponent(props: ElementProps<Element> & { thisType: string, deleteElement: () => void }) {
  const [ type, setType ] = useState(props.thisType);
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

  const Icon = (elementMap[type] as ElementPackage<Element>).icon;

  function reset() {
    props.originalValue = (elementMap[type] as ElementPackage<Element>).defaultValue;
  }

  const Component = (elementMap[type] as ElementPackage<Element>).Component;

  return (
    <Stack
      sx={{ flexGrow: 1, backgroundColor: (theme) => theme.palette.grey[900] }}
      style={{ height: "100%" }}
      borderRadius={1}
    >
      {props.mode == ViewMode.Edit && (
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
        {...props}
      />

      <SettingsDialog
        props={props}
        type={type}
        isOpen={isSettingsOpen}
        setType={setType}
        setIsOpen={setIsSettingsOpen}
        deleteElement={props.deleteElement}
      />
    </Stack>
  );
}
