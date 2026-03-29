'use client'

import generateText from "@/lib/ai/functions";
import speakText from "@/lib/tts/functions";

import { TextField, Stack, Card, CardContent, LinearProgress, CardActions, Pagination, PaginationItem, Tooltip, Chip, IconButton, Slider, Typography } from '@mui/material';
import { Add, AutoAwesome, Delete, MotionPhotosAuto, MotionPhotosOff, Pause, PlayArrow, Refresh } from '@mui/icons-material';
import { useEffect, useState } from "react";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import { Element, TextProps } from "@/lib/types/element";
import { useCookies } from "react-cookie";
import { ModelType } from "@/lib/ai/types";
import { ViewMode } from "@/lib/types/general";
import { Type } from '@google/genai';

export interface ElementType extends Element {
  text: string
};

export const defaultValue: ElementType = {
  text: "",
  requiresCompletion: false
}

export const schema = {
  type: Type.OBJECT,
  properties: {
    correctAnswer: {
      type: Type.STRING
    }
  },
  propertyOrdering: [
    "text"
  ]
};

export default function Component(props: TextProps) {
  const [ cookies, setCookie ] = useCookies([ 'autoReadAloud' ]);
  const [ isPlaying, setIsPlaying ] = useState(false);

  async function rephrase() {
    props.setIsThinking(true);
    
    const newText = await generateText({
      model: ModelType.Quick,
      prompt:
      `TASK:
      Rephrase a given TEXT. 
      
      TEXT:
      ${props.currentValue}`,
      systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
    });

    props.setCurrentValue(newText);
    props.setIsThinking(false);
  }

  async function readAloud() {
    if (!cookies.autoReadAloud)
      return;

    const request = {
      input: { text: props.currentValue },
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

  async function reset() {
    props.setCurrentValue(props.originalValue);
  }

  useEffect(() => { readAloud() },  []);

  return (
    <Card
      sx={{ height: '200px' }}
    >
      <CardContent
        style={{ height: 'calc(100% - 56px)', overflowY: 'auto' }}
      >
        {props.isThinking && (
          <LinearProgress
            sx={{ marginBottom: '8px' }}
          />
        )}

        {(props.mode == ViewMode.Edit ? (
          <TextField
            hiddenLabel={true}
            multiline
            value={props.currentValue}
            onChange={(e) => {
              props.setCurrentValue(e.target.value);
            }}
            fullWidth={true}
            /*slotProps={{
              input: {
                style: { height: "100px", overflowY: "auto" }
              },
              htmlInput: {
                style: { height: "100px" }
              }
            }}*/
          />
        ) : (
          <MarkdownTypewriter
            delay={30}
            motionProps={
              {
                characterVariants: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { opacity: { duration: 0.1 } } } }
              }
            }
          >
            {props.isThinking ? "*Thinking...*" : props.currentValue}
          </MarkdownTypewriter>
        ))}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Pagination
          count={props.totalPagesInChapter}
          page={props.currentPageIndex + 1}
          disabled={props.isThinking}
          renderItem={(item) => (
            <PaginationItem // TODO: Make this reorderable
              {...item}
              disabled={props.isThinking || (item.page ?? 0) <= 0 || (item.page ?? 0) > props.totalPagesInChapter || (props.mode == ViewMode.View && (!props.pagesCompleted[props.currentPageIndex + (item.page ?? 0) - 2] && (item.page ?? 0) != 1))}
              onClick={() => props.setCurrentPageIndex((item.page ?? 0) - 1 )}
            />
          )}
          sx={{ width: "300px" }}
        />

        {props.mode != ViewMode.Edit && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1 }}
          >
            <Tooltip
              title="Play/pause the text-to-speech"
            >
              <IconButton
                disabled={props.isThinking}
                onClick={(e) => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Automatically read new text it appears"
            >
              <IconButton
                disabled={props.isThinking}
                onClick={(e) => setCookie('autoReadAloud', !cookies.autoReadAloud, { path: '/' })}
              >
                {cookies.autoReadAloud ? <MotionPhotosAuto /> : <MotionPhotosOff />}
              </IconButton>
            </Tooltip>

            <Stack
              spacing={2}
              direction="row"
              sx={{ alignItems: 'center', flexGrow: 1 }}
            >
              <Typography
                variant='caption'
              >
                0:00
              </Typography>
  
              <Slider
                disabled={props.isThinking}
                max={60}
                valueLabelDisplay="auto"
                valueLabelFormat={(value: number) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, "0")}`}
                sx={{ flexGrow: 1 }}
              />
  
              <Typography
                variant='caption'
              >
              1:00
              </Typography>
            </Stack>
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={1}
          sx={{ width: "350px" }}
          justifyContent="end"
        >
          {props.mode == ViewMode.Edit ? (
            <>
              <Tooltip
                title="Insert a new page after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Page Before"
                />
              </Tooltip>

              <Tooltip
                title="Insert a new page after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Page After"
                />
              </Tooltip>

              <Tooltip
                title="Delete this page"
              >
                <Chip
                  icon={<Delete />}
                  label="Delete Page"
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip
                title="Rephrase this text in simpler terms"
              >
                <Chip
                  icon={<AutoAwesome />}
                  label="Rephrase"
                  onClick={(e) => rephrase()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Reset this page back to its original state"
              >
                <Chip
                  icon={<Refresh />}
                  label="Reset"
                  onClick={(e) => reset()}
                  disabled={props.isThinking}
                />
              </Tooltip>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
