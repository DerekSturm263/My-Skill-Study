'use client'

import ReorderList, { ReorderIcon } from 'react-reorder-list';
import Files from '@/interactions/files/elements';
import Drawing from '@/interactions/drawing/elements';
import Graph from '@/interactions/graph/elements';
import DAW from '@/interactions/daw/elements';
import Codespace from '@/interactions/codespace/elements';
import ThreeDModeling from '@/interactions/3d_modeling/elements';
import GameEngine from '@/interactions/game_engine/elements';
import ShortAnswer from '@/interactions/short_answer/elements';
import TrueOrFalse from '@/interactions/true_or_false/elements';
import MultipleChoice from '@/interactions/multiple_choice/elements';
import Ordering from '@/interactions/ordering/elements';
import Matching from '@/interactions/matching/elements';
import Embed from '@/interactions/embed/elements';

import { IconButton, Typography, Stack, ListItemText, MenuItem, Toolbar, Select, ListItemIcon, Tooltip } from '@mui/material';
import { ViewMode, InteractionProps, InteractionPackageBase, InteractionPackage, Interaction } from '../lib/types/general';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { DragHandle, Settings } from '@mui/icons-material';
import { Component as TextComponent } from '@/interactions/text/elements'; 
import { useSearchParams } from 'next/navigation';
import { SettingsDialog } from './dialogs';
import { Verification } from '@/lib/ai/types';
import { Page } from '@/lib/types/skill';

export const interactionMap: Record<string, InteractionPackageBase> = {
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

export function PageComponent({ element, mode, isThinking, pagesCompleted: elementsCompleted, currentChapterIndex: currentPageIndex, currentPageIndex: currentElementIndex, totalPagesInChapter: totalElementsInPage, setIsThinking, setCurrentPageIndex: setCurrentElementIndex, setSnackbarText, setIsPageComplete: setIsElementComplete }: { element: Page, mode: ViewMode, isThinking: boolean, pagesCompleted: boolean[][], currentChapterIndex: number, currentPageIndex: number, totalPagesInChapter: number, setIsThinking: Dispatch<SetStateAction<boolean>>, setCurrentPageIndex: Dispatch<SetStateAction<number>>, setSnackbarText: (text: string) => void, setIsPageComplete: (isComplete: boolean) => void }) {
  const searchParams = useSearchParams();
  const hideHeader = searchParams.get('hideHeader') === 'true';

  const [ text, setText ] = useState(element.text.text);

  useEffect(() => {
    if (element.interactions.every(interaction => !interaction.value.requiresCompletion)) {
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

      <ReorderList
        useOnlyIconToDrag={true}
        props={{ style: { display: "flex", flexDirection: "row", gap: 8, flexGrow: 1, padding: mode == ViewMode.Edit ? "8px" : "0px" }}}
      >
        {element.interactions.map((interaction, index) => (
          <InteractionComponent
            key={index}
            thisType={interaction.type}
            text={element.text.text}
            originalValue={interaction.value}
            chapterIndex={currentPageIndex}
            pageIndex={currentElementIndex}
            totalElementsInChapter={totalElementsInPage}
            isThinking={isThinking}
            pagesCompleted={elementsCompleted}
            mode={mode}
            setText={setText}
            evaluateAndReply={async (promise: Promise<Verification>) => {
              setIsThinking(true);

              const verification = await promise;
              setText(verification.feedback);
    
              setIsThinking(false);

              if (verification.isValid) {
                setIsComplete(true, true);
              }
            }}
            setCurrentElementIndex={setCurrentElementIndex}
          />
        ))}
      </ReorderList>

      <TextComponent
        text={text}
        originalValue={element.text}
        chapterIndex={currentPageIndex}
        pageIndex={currentElementIndex}
        totalElementsInChapter={totalElementsInPage}
        isThinking={isThinking}
        pagesCompleted={elementsCompleted}
        mode={mode}
        setText={setText}
        evaluateAndReply={async (promise: Promise<Verification>) => {
          setIsThinking(true);

          const verification = await promise;
          setText(verification.feedback);
    
          setIsThinking(false);
        }}
        setCurrentElementIndex={setCurrentElementIndex}
      />
    </Stack>
  );
}

export function InteractionComponent(props: InteractionProps<Interaction> & { thisType: string }) {
  const [ type, setType ] = useState(props.thisType);
  const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

  const Icon = (interactionMap[type] as InteractionPackage<Interaction>).icon;

  function reset() {
    props.originalValue = (interactionMap[type] as InteractionPackage<Interaction>).defaultValue;
  }

  const Component = (interactionMap[type] as InteractionPackage<Interaction>).Component;

  return (
    <Stack
      sx={{ flexGrow: 1, backgroundColor: (theme) => theme.palette.grey[900] }}
    >
      {props.mode == ViewMode.Edit && (<Stack
        direction="row"
        sx={{ justifyContent: "space-between", backgroundColor: (theme) => theme.palette.grey[800] }}
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
            {(interactionMap[type] as InteractionPackage<Interaction>).prettyName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={0}
        >
          <Tooltip
            title="Move this interaction"
          >
            <ReorderIcon>
              <DragHandle />
            </ReorderIcon>
          </Tooltip>
          
          <Tooltip
            title="Edit this interaction"
          >
            <IconButton
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>)}

      <Component
        {...props}
      />

      <SettingsDialog
        props={props}
        type={type}
        isOpen={isSettingsOpen}
        setType={setType}
        setIsOpen={setIsSettingsOpen}
      />
    </Stack>
  );
}

export function TypeSwitcher({ props, type, setType }: { props: InteractionProps<Interaction>, type: string, setType: Dispatch<SetStateAction<string>> }) {
  function setTypeAndReset(type: string) {
    setType(type);
    props.originalValue = (interactionMap[type] as InteractionPackage<Interaction>).defaultValue;
  }

  return (
    <Select
      value={type}
      label="Type"
      onChange={(e) => setTypeAndReset(e.target.value)}
      autoWidth={true}
      renderValue={(value: string) => {
        const Icon = interactionMap[value].icon;

        return (
          <Stack
            direction="row"
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
                  
            <ListItemText>
              {interactionMap[value].prettyName}
            </ListItemText>
          </Stack>
        );
      }}
    >
      {Object.values(interactionMap).map(interaction => (
        <MenuItem
          key={interaction.id}
          value={interaction.id}
        >
          <ListItemIcon>
            <interaction.icon />
          </ListItemIcon>
                  
          <ListItemText>
            {interaction.prettyName}
          </ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
}
