'use client'

import generateText from "@/lib/ai/functions";
import speakText from "@/lib/tts/functions";

import { TextField, Stack, Card, CardContent, LinearProgress, CardActions, Pagination, PaginationItem, Tooltip, Chip, IconButton, Slider, Typography } from '@mui/material';
import { Add, AutoAwesome, Delete, MotionPhotosAuto, MotionPhotosOff, Pause, PlayArrow, Refresh, TextSnippet } from '@mui/icons-material';
import { ViewMode, InteractionProps, InteractionPackage } from "@/lib/types/general";
import { ModelType, Verification } from "@/lib/ai/types";
import { useEffect, useState } from "react";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import { useCookies } from "react-cookie";
import { Type } from '@google/genai';

export interface InteractionType {
  text: string
};

const defaultValue: InteractionType = {
  text: ""
}

const schema = {
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

export function Component(props: InteractionProps<InteractionType>) {
  const [ cookies, setCookie ] = useCookies([ 'autoReadAloud' ]);
  const [ isPlaying, setIsPlaying ] = useState(false);
  
  async function rephrase(): Promise<Verification> {
    return {
      feedback: await generateText({
        model: ModelType.Quick,
        prompt:
        `TASK:
        Rephrase a given TEXT. 
      
        TEXT:
        ${props.text}`,
        systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
      }),
      isValid: true
    };
  }

  async function readAloud() {
    if (!cookies.autoReadAloud)
      return;

    const request = {
      input: { text: props.text },
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
    props.setText(props.originalValue.text);
  }

  useEffect(() => { readAloud() },  []);

  return (
    <Card>
      <CardContent
        style={{ height: '20vh', overflowY: 'auto' }}
      >
        {props.isThinking && <LinearProgress />}

        {(props.mode == ViewMode.Edit ? (
          <TextField
            hiddenLabel={true}
            multiline
            defaultValue={props.text}
            rows={4}
            onChange={(e) => {
              props.setText(e.target.value);
            }}
            fullWidth={true}
          />
        ) : (
          <MarkdownTypewriter
            delay={30}
          >
            {props.isThinking ? "Thinking..." : props.text}
          </MarkdownTypewriter>
        ))}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Pagination
          count={props.totalElementsInPage}
          page={props.elementIndex + 1}
          disabled={props.isThinking}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={props.isThinking || (item.page ?? 0) <= 0 || (item.page ?? 0) > props.totalElementsInPage || (!props.elementsCompleted[props.pageIndex][props.elementIndex + (item.page ?? 0) - 2] && (item.page ?? 0) != 1)}
              onClick={() => props.setCurrentElementIndex((item.page ?? 0) - 1 )}
            />
          )}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{ width: '500px' }}
        >
          <IconButton
            disabled={props.isThinking}
            onClick={(e) => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

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
              sx={{ flexGrow: 1 }}
            />
  
            <Typography
              variant='caption'
            >
              1:00
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
        >
          {props.mode == ViewMode.Edit ? (
            <>
              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element Before"
                />
              </Tooltip>

              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element After"
                />
              </Tooltip>

              <Tooltip
                title="Delete this element"
              >
                <Chip
                  icon={<Delete />}
                  label="Delete"
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
                  onClick={(e) => props.evaluateAndReply(rephrase())}
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

const interaction: InteractionPackage<InteractionType> = {
  id: "text",
  prettyName: "Text",
  category: "General",
  icon: TextSnippet,
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
