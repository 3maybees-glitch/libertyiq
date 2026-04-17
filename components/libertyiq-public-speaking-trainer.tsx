"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Play, RotateCcw, Trophy, Volume2, AlertCircle, CheckCircle2, Brain, BarChart3, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Drop-in LibertyIQ feature for v0.app
// Notes:
// 1) Uses browser SpeechRecognition when available for live transcription.
// 2) Uses MediaRecorder to capture audio blobs for potential future upload/storage.
// 3) Entirely client-side. No API key required.
// 4) Safe fallback: users can paste/type transcript manually if speech recognition is unavailable.

declare global {
  interface Window {
    webkitSpeechRecognition?: any
    SpeechRecognition?: any
  }
}

type AnalysisResult = {
  wordCount: number
  fillerCounts: Record<string, number>
  totalFillers: number
  fillerPer100: number
  avgWordsPerSentence: number
  sentenceCount: number
  clarityScore: number
  confidenceScore: number
  overallScore: number
  coaching: string[]
  strengths: string[]
}

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "so",
  "actually",
  "basically",
  "literally",
  "kind of",
  "sort of",
  "i mean",
]

const PRACTICE_PROMPTS = [
  "Tell me about yourself in 30 seconds.",
  "Explain why clear communication matters in leadership.",
  "Give a 45-second response to: What is your greatest strength?",
  "Defend an unpopular idea in a calm and confident way.",
  "Summarize a recent news event in simple, direct language.",
]

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[\n\r]+/g, " ")
    .replace(/[^a-z0-9'.!?\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function countPhraseOccurrences(text: string, phrase: string) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`\\b${escaped}\\b`, "gi")
  const matches = text.match(regex)
  return matches ? matches.length : 0
}

function analyzeSpeech(transcript: string): AnalysisResult {
  const normalized = normalizeText(transcript)
  const words = normalized ? normalized.split(/\s+/).filter(Boolean) : []
  const wordCount = words.length

  const fillerCounts: Record<string, number> = {}
  let totalFillers = 0

  for (const filler of FILLER_WORDS) {
    const count = countPhraseOccurrences(normalized, filler)
    fillerCounts[filler] = count
    totalFillers += count
  }

  const sentences = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const sentenceCount = Math.max(sentences.length, 1)
  const avgWordsPerSentence = wordCount > 0 ? wordCount / sentenceCount : 0
  const fillerPer100 = wordCount > 0 ? (totalFillers / wordCount) * 100 : 0

  // Heuristic scoring tuned for coaching, not clinical measurement.
  let clarityScore = 100
  let confidenceScore = 100

  // Clarity: penalize filler density and extreme sentence length.
  clarityScore -= Math.min(fillerPer100 * 6, 40)
  if (avgWordsPerSentence > 24) clarityScore -= Math.min((avgWordsPerSentence - 24) * 1.5, 18)
  if (avgWordsPerSentence < 5 && wordCount > 20) clarityScore -= 10
  if (wordCount < 20) clarityScore -= 10

  // Confidence: filler usage + hedging phrases + excessive repetition.
  const hedges = ["maybe", "i think", "probably", "perhaps", "hopefully"]
  const hedgeCount = hedges.reduce((sum, h) => sum + countPhraseOccurrences(normalized, h), 0)
  confidenceScore -= Math.min(totalFillers * 2.5, 35)
  confidenceScore -= Math.min(hedgeCount * 4, 20)
  if (wordCount < 15) confidenceScore -= 12

  clarityScore = Math.max(35, Math.min(100, Math.round(clarityScore)))
  confidenceScore = Math.max(35, Math.min(100, Math.round(confidenceScore)))
  const overallScore = Math.round((clarityScore + confidenceScore) / 2)

  const strengths: string[] = []
  const coaching: string[] = []

  if (totalFillers <= 2 && wordCount >= 25) {
    strengths.push("Strong verbal discipline with very low filler usage.")
  }
  if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 20) {
    strengths.push("Sentence pacing looks balanced and easier to follow.")
  }
  if (confidenceScore >= 80) {
    strengths.push("Your phrasing reads as direct and reasonably confident.")
  }

  if (totalFillers > 0) {
    coaching.push(`You used ${totalFillers} filler word${totalFillers === 1 ? "" : "s"}. Pause silently instead of filling space.`)
  }
  if (fillerCounts["um"] > 0) {
    coaching.push(`You said “um” ${fillerCounts["um"]} time${fillerCounts["um"] === 1 ? "" : "s"}. Slow down at transition points.`)
  }
  if (fillerCounts["uh"] > 0) {
    coaching.push(`You said “uh” ${fillerCounts["uh"]} time${fillerCounts["uh"] === 1 ? "" : "s"}. Try one beat of silence before your next point.`)
  }
  if (avgWordsPerSentence > 24) {
    coaching.push("Your sentences may be running long. Break big ideas into shorter statements.")
  }
  if (wordCount < 20) {
    coaching.push("Your response was short. Add one example or one supporting detail to sound more developed.")
  }
  if (hedgeCount >= 2) {
    coaching.push("You used several hedge phrases. Replace soft phrasing with direct statements where possible.")
  }
  if (coaching.length === 0) {
    coaching.push("Nice job. Your response was fairly clean. Next level: vary emphasis and tighten your opening sentence.")
  }

  return {
    wordCount,
    fillerCounts,
    totalFillers,
    fillerPer100: Number(fillerPer100.toFixed(1)),
    avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
    sentenceCount,
    clarityScore,
    confidenceScore,
    overallScore,
    coaching,
    strengths,
  }
}

function scoreLabel(score: number) {
  if (score >= 90) return "Chief Strategist"
  if (score >= 80) return "Senior Fellow"
  if (score >= 70) return "Analyst"
  if (score >= 60) return "Intern Analyst"
  return "Trainee"
}

export default function LibertyIQPublicSpeakingTrainer() {
  const [selectedPrompt, setSelectedPrompt] = useState(PRACTICE_PROMPTS[0])
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(false)
  const [supportsMediaRecorder, setSupportsMediaRecorder] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [activeTab, setActiveTab] = useState("trainer")

  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setSupportsSpeechRecognition(Boolean(SpeechRecognition))
    setSupportsMediaRecorder(typeof window !== "undefined" && "MediaRecorder" in window)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const finalTranscript = useMemo(() => {
    return [transcript, interimTranscript].filter(Boolean).join(" ").trim()
  }, [transcript, interimTranscript])

  const analysis = useMemo(() => analyzeSpeech(finalTranscript), [finalTranscript])

  async function startRecording() {
    setError(null)
    setAudioURL(null)
    setTranscript("")
    setInterimTranscript("")
    setDurationSeconds(0)
    recordedChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      if (supportsMediaRecorder) {
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) recordedChunksRef.current.push(event.data)
        }
        recorder.onstop = () => {
          if (recordedChunksRef.current.length > 0) {
            const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
            const url = URL.createObjectURL(blob)
            setAudioURL(url)
          }
        }
        recorder.start()
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = "en-US"
        recognition.continuous = true
        recognition.interimResults = true
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          let interim = ""
          let final = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const chunk = event.results[i][0].transcript
            if (event.results[i].isFinal) final += `${chunk} `
            else interim += chunk
          }
          if (final) setTranscript((prev) => `${prev} ${final}`.trim())
          setInterimTranscript(interim.trim())
        }

        recognition.onerror = (event: any) => {
          if (event.error !== "aborted") {
            setError(`Speech recognition error: ${event.error}`)
          }
        }

        recognition.onend = () => {
          // Prevent silent auto-restarts once user manually stops.
        }

        recognitionRef.current = recognition
        recognition.start()
      }

      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1)
      }, 1000)

      setIsRecording(true)
    } catch (err) {
      console.error(err)
      setError("Microphone access was blocked or unavailable. You can still paste your transcript manually.")
      setIsRecording(false)
    }
  }

  function stopRecording() {
    setIsRecording(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
  }

  function resetSession() {
    if (isRecording) stopRecording()
    setTranscript("")
    setInterimTranscript("")
    setAudioURL(null)
    setDurationSeconds(0)
    setError(null)
  }

  function loadRandomPrompt() {
    const next = PRACTICE_PROMPTS[Math.floor(Math.random() * PRACTICE_PROMPTS.length)]
    setSelectedPrompt(next)
  }

return (
    <div className="min-h-screen">
      {/* Hero Header with Back Link */}
      <div className="bg-primary/20 border-b border-border">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Public Speaking Trainer</h1>
              <p className="text-foreground mt-2 text-base md:text-lg">
                Practice short spoken responses and get instant LibertyIQ-style coaching on clarity, filler words, and confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                <Mic className="w-4 h-4 mr-1.5" /> Native microphone practice
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1.5 bg-card/50">
                <Brain className="w-4 h-4 mr-1.5" /> Client-side analysis
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid gap-6">

<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[340px] bg-muted/60">
            <TabsTrigger value="trainer" className="text-foreground data-[state=active]:text-foreground">Trainer</TabsTrigger>
            <TabsTrigger value="results" className="text-foreground data-[state=active]:text-foreground">Results</TabsTrigger>
          </TabsList>

<TabsContent value="trainer" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-2xl shadow-sm bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">Practice Prompt</CardTitle>
                  <CardDescription className="text-base text-foreground">Use one of these prompts or replace it with your own interview, debate, or presentation question.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="min-h-[110px] text-base"
                    placeholder="Enter your speaking prompt"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={loadRandomPrompt}>
                      <RotateCcw className="w-4 h-4 mr-2" /> New Prompt
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {PRACTICE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setSelectedPrompt(prompt)}
                        className={`text-left rounded-xl border p-3 text-sm transition hover:bg-muted ${selectedPrompt === prompt ? "border-primary bg-muted" : "border-border"}`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

<Card className="rounded-2xl shadow-sm bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">Record Response</CardTitle>
                  <CardDescription className="text-base text-foreground">
                    Speak for 30-60 seconds. The app will analyze your transcript and coaching metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {!supportsSpeechRecognition && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-foreground">Live transcription not supported here</AlertTitle>
                      <AlertDescription className="text-foreground">
                        Your browser may not support the Web Speech API. You can still record audio and paste your transcript manually below.
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Recording issue</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

<div className="rounded-2xl border border-border bg-secondary/20 p-5">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${isRecording ? "border-primary animate-pulse bg-primary/20" : "border-foreground/30"}`}>
                        {isRecording ? <Mic className="h-9 w-9 text-foreground" /> : <MicOff className="h-9 w-9 text-foreground/70" />}
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-foreground">{durationSeconds}s</p>
                        <p className="text-sm text-foreground/70">
                          {isRecording ? "Recording in progress" : "Ready to begin"}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {!isRecording ? (
                          <Button size="lg" onClick={startRecording}>
                            <Mic className="w-4 h-4 mr-2" /> Start Recording
                          </Button>
                        ) : (
                          <Button size="lg" variant="destructive" onClick={stopRecording}>
                            <MicOff className="w-4 h-4 mr-2" /> Stop Recording
                          </Button>
                        )}
                        <Button size="lg" variant="outline" onClick={resetSession}>
                          <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                      </div>
                    </div>
                  </div>

{audioURL && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Playback</p>
                      <audio controls src={audioURL} className="w-full" />
                    </div>
                  )}

<div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Transcript</label>
                    <Textarea
                      value={finalTranscript}
                      onChange={(e) => {
                        setTranscript(e.target.value)
                        setInterimTranscript("")
                      }}
                      className="min-h-[180px] text-base"
                      placeholder="Your live transcript will appear here. You can also type or paste text manually."
                    />
                    <p className="text-xs text-muted-foreground">
                      Manual editing is enabled so users can clean up the transcript before reviewing results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

<TabsContent value="results" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-6">
                <Card className="rounded-2xl shadow-sm bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">Score Snapshot</CardTitle>
                    <CardDescription className="text-base text-foreground/70">Fast speaking feedback based on your current transcript.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-foreground/70">Overall</p>
                          <p className="text-4xl font-bold text-foreground">{analysis.overallScore}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="text-sm px-3 py-1">
                            <Trophy className="w-4 h-4 mr-1" /> {scoreLabel(analysis.overallScore)}
                          </Badge>
                        </div>
                      </div>
<div className="mt-4 grid gap-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm text-foreground">
                            <span>Clarity</span>
                            <span>{analysis.clarityScore}/100</span>
                          </div>
                          <Progress value={analysis.clarityScore} />
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm text-foreground">
                            <span>Confidence</span>
                            <span>{analysis.confidenceScore}/100</span>
                          </div>
                          <Progress value={analysis.confidenceScore} />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm text-foreground/70">Word count</p>
                        <p className="text-2xl font-semibold text-foreground">{analysis.wordCount}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm text-foreground/70">Filler words</p>
                        <p className="text-2xl font-semibold text-foreground">{analysis.totalFillers}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm text-foreground/70">Fillers / 100 words</p>
                        <p className="text-2xl font-semibold text-foreground">{analysis.fillerPer100}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm text-foreground/70">Avg words / sentence</p>
                        <p className="text-2xl font-semibold text-foreground">{analysis.avgWordsPerSentence}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

<Card className="rounded-2xl shadow-sm bg-secondary/20 border-secondary/40">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">Filler Word Breakdown</CardTitle>
                    <CardDescription className="text-base text-foreground/70">These verbal crutches are commonly overused in interviews, talks, and debates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(analysis.fillerCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([word, count]) => (
                          <div key={word} className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-3 py-2 text-sm">
                            <span className="capitalize text-foreground">{word}</span>
                            <Badge variant={count > 0 ? "default" : "secondary"}>{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

<div className="grid gap-6">
                <Card className="rounded-2xl shadow-sm bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">Coaching Feedback</CardTitle>
                    <CardDescription className="text-base text-foreground/70">Actionable suggestions to make your next response sharper and more persuasive.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg text-foreground">Strengths</h3>
                      </div>
                      <div className="space-y-2">
                        {analysis.strengths.length > 0 ? (
                          analysis.strengths.map((item, index) => (
                            <div key={index} className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground/70">
                            Record a longer response to surface stronger coaching strengths.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-secondary" />
                        <h3 className="font-semibold text-lg text-foreground">Improvement Focus</h3>
                      </div>
                      <div className="space-y-2">
                        {analysis.coaching.map((item, index) => (
                          <div key={index} className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

<Card className="rounded-2xl shadow-sm bg-primary/10 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">Suggested LibertyIQ Add-Ons</CardTitle>
                    <CardDescription className="text-base text-foreground/70">Easy upgrades once this first version is working inside your app.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="rounded-xl border border-border bg-card/50 p-3">
                      <span className="font-medium text-foreground">1. Session history:</span> <span className="text-foreground/80">Save the score, transcript, and date in local storage or your DB.</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card/50 p-3">
                      <span className="font-medium text-foreground">2. Prompt packs:</span> <span className="text-foreground/80">Interview mode, debate mode, leadership mode, classroom mode.</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card/50 p-3">
                      <span className="font-medium text-foreground">3. Native polish:</span> <span className="text-foreground/80">In a real mobile build, swap browser transcription for a backend speech-to-text service.</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card/50 p-3">
                      <span className="font-medium text-foreground">4. Progression:</span> <span className="text-foreground/80">Award XP for streaks, low filler counts, and improved confidence score.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
</TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}
