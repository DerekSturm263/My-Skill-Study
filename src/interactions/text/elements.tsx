'use client'

import generateText from "@/lib/ai/functions";

import { TextField, Stack, Card, CardContent, LinearProgress, CardActions, Pagination, PaginationItem, Tooltip, Chip } from '@mui/material';
import { Add, AutoAwesome, Delete, RecordVoiceOver, Refresh, TextSnippet, VoiceOverOff, VolumeUp } from '@mui/icons-material';
import { ViewMode, InteractionProps, InteractionPackage } from "@/lib/types/general";
import { ModelType, Verification } from "@/lib/ai/types";
import { useEffect, useState } from "react";
import { MarkdownTypewriter } from "react-markdown-typewriter";
import { Interaction } from "@/lib/types/general";
import { useCookies } from "react-cookie";
import { Type } from '@google/genai';
import speakText from "@/lib/tts/functions";

export interface InteractionType extends Interaction {
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

  const [ value, setValue ] = useState(props.originalValue);
  const [ doAutoReadAloud, setDoAutoReadAloud ] = useState(cookies.autoReadAloud);

  async function readAloud() {
    const request = {
      input: { text: value.text },
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
    setValue({ ... value, text: props.originalValue.text });
  }

  useEffect(() => { readAloud() },  []);
  
  async function rephrase(): Promise<Verification> {
    return {
      feedback: await generateText({
        model: ModelType.Quick,
        prompt:
        `TASK:
        Rephrase a given TEXT. 
      
        TEXT:
        ${value.text}`,
        systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
      }),
      isValid: true
    };
  }

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
            defaultValue={value.text}
            rows={4}
            onChange={(e) => {
              setValue({ ... value, text: e.target.value });
            }}
            fullWidth={true}
          />
        ) : (
          <MarkdownTypewriter>
            {props.isThinking ? "Thinking..." : value.text}
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
                title="Read this text out loud"
              >
                <Chip
                  icon={<VolumeUp />}
                  label="Read Aloud"
                  onClick={(e) => readAloud()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title={`Turn ${doAutoReadAloud ? "off" : "on"} immediately reading new text aloud`}
              >
                <Chip
                  icon={doAutoReadAloud ? <VoiceOverOff /> : <RecordVoiceOver />}
                  label={`Turn ${doAutoReadAloud ? "Off" : "On"} Auto Read`}
                  onClick={(e) => toggleAutoReadAloud()}
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
