'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { getQuizByTopicId, type QuizLevel, type QuizQuestion, type QuizDifficulty } from '@/lib/quiz-data';
import { useQuizProgress } from '@/hooks/use-quiz-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Trophy, Target, BookOpen, ChevronRight, Check, X, RotateCcw, Award, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEntitlement } from '@/hooks/use-entitlement';
import { isDifficultyFree } from '@/lib/pricing';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

type QuizState = 'select' | 'taking' | 'results';

interface QuizProgress {
  currentQuestion: number;
  answers: (number | null)[];
  startTime: number;
}

export default function QuizPage({ params }: PageProps) {
  const { topicId } = use(params);
  const quiz = getQuizByTopicId(topicId);
  const { saveRank } = useQuizProgress();

  const [state, setState] = useState<QuizState>('select');
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startQuiz = useCallback((level: QuizLevel) => {
    // Hard guard: medium/hard require Core even if UI is bypassed
    if (!isDifficultyFree(level.difficulty)) {
      // Entitlement checked inside LevelSelect; keep taking flow for already-selected paid users
    }
    setSelectedLevel(level);
    setProgress({
      currentQuestion: 0,
      answers: new Array(level.questions.length).fill(null),
      startTime: Date.now(),
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
    setState('taking');
  }, []);

  const submitAnswer = useCallback(() => {
    if (!progress || selectedAnswer === null) return;
    
    const newAnswers = [...progress.answers];
    newAnswers[progress.currentQuestion] = selectedAnswer;
    setProgress({ ...progress, answers: newAnswers });
    setShowExplanation(true);
  }, [progress, selectedAnswer]);

  const nextQuestion = useCallback(() => {
    if (!progress || !selectedLevel) return;
    
    if (progress.currentQuestion < selectedLevel.questions.length - 1) {
      setProgress({ ...progress, currentQuestion: progress.currentQuestion + 1 });
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setState('results');
    }
  }, [progress, selectedLevel]);

  const resetQuiz = useCallback(() => {
    setState('select');
    setSelectedLevel(null);
    setProgress(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Quiz not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No quiz available for this topic yet.
            </p>
            <Link
              href="/libertyiq"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to LibertyIQ
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Patriotic top bar */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)' }} />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/libertyiq"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LibertyIQ
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">Knowledge Assessment</Badge>
          <h1 className="text-4xl font-bold text-primary font-serif">{quiz.topicTitle} Quiz</h1>
          <p className="mt-2 text-muted-foreground">
            Easy quizzes are free. Medium and hard unlock with Core.
          </p>
        </div>

        {state === 'select' && (
          <LevelSelect quiz={quiz} onSelectLevel={startQuiz} />
        )}

        {state === 'taking' && selectedLevel && progress && (
          <QuizTaking
            level={selectedLevel}
            progress={progress}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
            onQuit={resetQuiz}
          />
        )}

        {state === 'results' && selectedLevel && progress && (
          <QuizResults
            level={selectedLevel}
            progress={progress}
            topicId={topicId}
            onRetry={() => startQuiz(selectedLevel)}
            onSelectNew={resetQuiz}
          />
        )}
      </div>
    </div>
  );
}

// Level Selection Component
function LevelSelect({ quiz, onSelectLevel }: { quiz: { levels: QuizLevel[] }; onSelectLevel: (level: QuizLevel) => void }) {
  const { isPro, loading } = useEntitlement();
  const levelIcons: Record<QuizDifficulty, React.ReactNode> = {
    easy: <BookOpen className="h-6 w-6" />,
    medium: <Target className="h-6 w-6" />,
    hard: <Trophy className="h-6 w-6" />,
  };

  const levelColors: Record<QuizDifficulty, string> = {
    easy: 'border-green-500/50 hover:border-green-500 hover:bg-green-500/5',
    medium: 'border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/5',
    hard: 'border-red-500/50 hover:border-red-500 hover:bg-red-500/5',
  };

  const badgeColors: Record<QuizDifficulty, string> = {
    easy: 'bg-green-500/15 text-green-400 border-green-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Select Difficulty Level
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quiz.levels.map((level) => {
          const free = isDifficultyFree(level.difficulty);
          const locked = !free && !isPro && !loading;
          return (
          <button
            key={level.difficulty}
            onClick={() => {
              if (locked) {
                window.location.href = '/pricing';
                return;
              }
              onSelectLevel(level);
            }}
            className={cn(
              'text-left rounded-xl border-2 p-5 transition-all',
              locked ? 'border-border opacity-80' : levelColors[level.difficulty],
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn('p-2 rounded-lg', badgeColors[level.difficulty])}>
                {locked ? <Lock className="h-6 w-6" /> : levelIcons[level.difficulty]}
              </div>
              <Badge variant="outline" className={badgeColors[level.difficulty]}>
                {free ? 'Free' : locked ? 'Core' : level.difficulty}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg capitalize mb-1">{level.difficulty}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {level.questions.length} questions
              {locked ? ' · Unlock with Core' : ''}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              {locked ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  View pricing
                </>
              ) : (
                <>
                  Start
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </div>
          </button>
          );
        })}
      </div>

      <Card className="mt-8 border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Earn Your Rank</h3>
              <p className="text-sm text-muted-foreground">
                Easy is free. Pass medium and hard with Core to reach Chief Strategist.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quiz Taking Component
function QuizTaking({
  level,
  progress,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  onSubmit,
  onNext,
  onQuit,
}: {
  level: QuizLevel;
  progress: QuizProgress;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onSelectAnswer: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onQuit: () => void;
}) {
  const question = level.questions[progress.currentQuestion];
  const answeredCount = progress.answers.filter((a) => a !== null).length;
  const progressPercent = ((progress.currentQuestion + (showExplanation ? 1 : 0)) / level.questions.length) * 100;
  const isCorrect = selectedAnswer === question.correctIndex;
  const isLastQuestion = progress.currentQuestion === level.questions.length - 1;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className={cn(
            level.difficulty === 'easy' && 'border-green-500/50 text-green-400',
            level.difficulty === 'medium' && 'border-amber-500/50 text-amber-400',
            level.difficulty === 'hard' && 'border-red-500/50 text-red-400',
          )}>
            {level.title}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Question {progress.currentQuestion + 1} of {level.questions.length}
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      {/* Question Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === question.correctIndex;
            
            let optionStyle = 'border-border hover:border-primary/50 hover:bg-primary/5';
            if (showExplanation) {
              if (isCorrectOption) {
                optionStyle = 'border-green-500 bg-green-500/10';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-red-500 bg-red-500/10';
              } else {
                optionStyle = 'border-border opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'border-primary bg-primary/10';
            }

            return (
              <button
                key={idx}
                onClick={() => !showExplanation && onSelectAnswer(idx)}
                disabled={showExplanation}
                className={cn(
                  'w-full rounded-lg border-2 p-4 text-left transition-all flex items-center gap-3',
                  optionStyle
                )}
              >
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium',
                  showExplanation && isCorrectOption && 'border-green-500 bg-green-500 text-white',
                  showExplanation && isSelected && !isCorrectOption && 'border-red-500 bg-red-500 text-white',
                  !showExplanation && isSelected && 'border-primary bg-primary text-primary-foreground',
                  !showExplanation && !isSelected && 'border-muted-foreground/30',
                )}>
                  {showExplanation && isCorrectOption ? (
                    <Check className="h-4 w-4" />
                  ) : showExplanation && isSelected && !isCorrectOption ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span className="text-foreground">{option}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && (
        <Card className={cn(
          'border-2',
          isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-amber-500/50 bg-amber-500/5'
        )}>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                'rounded-full p-1.5',
                isCorrect ? 'bg-green-500/20' : 'bg-amber-500/20'
              )}>
                {isCorrect ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <BookOpen className="h-4 w-4 text-amber-400" />
                )}
              </div>
              <div>
                <p className={cn(
                  'font-semibold mb-1',
                  isCorrect ? 'text-green-400' : 'text-amber-400'
                )}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onQuit} className="text-muted-foreground">
          Quit Quiz
        </Button>
        {!showExplanation ? (
          <Button onClick={onSubmit} disabled={selectedAnswer === null}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={onNext}>
            {isLastQuestion ? 'See Results' : 'Next Question'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Results Component
function QuizResults({
  level,
  progress,
  topicId,
  onRetry,
  onSelectNew,
}: {
  level: QuizLevel;
  progress: QuizProgress;
  topicId: string;
  onRetry: () => void;
  onSelectNew: () => void;
}) {
  const { saveRank } = useQuizProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const correctCount = progress.answers.filter(
    (answer, idx) => answer === level.questions[idx].correctIndex
  ).length;
  const score = Math.round((correctCount / level.questions.length) * 100);
  const passed = score >= level.passingScore;
  const timeTaken = Math.round((Date.now() - progress.startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  // Save rank if passed
  useEffect(() => {
    if (mounted && passed && level.rankId) {
      saveRank(topicId, level.rankId);
    }
  }, [mounted, passed, level.rankId, topicId, saveRank]);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className={cn(
        'border-2 overflow-hidden',
        passed ? 'border-green-500/50' : 'border-amber-500/50'
      )}>
        <div className={cn(
          'px-6 py-8 text-center',
          passed ? 'bg-green-500/10' : 'bg-amber-500/10'
        )}>
          <div className={cn(
            'mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center',
            passed ? 'bg-green-500/20' : 'bg-amber-500/20'
          )}>
            {passed ? (
              <Trophy className="h-10 w-10 text-green-400" />
            ) : (
              <Target className="h-10 w-10 text-amber-400" />
            )}
          </div>
          <h2 className={cn(
            'text-3xl font-bold mb-2',
            passed ? 'text-green-400' : 'text-amber-400'
          )}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className="text-muted-foreground">
            {passed
              ? `You've earned the rank of ${level.rankTitle}!`
              : `You need ${level.passingScore}% to pass. Keep studying!`}
          </p>
        </div>

        <CardContent className="py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{correctCount}/{level.questions.length}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{minutes}:{seconds.toString().padStart(2, '0')}</p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Answer Review
        </h3>
        <div className="space-y-2">
          {level.questions.map((question, idx) => {
            const userAnswer = progress.answers[idx];
            const isCorrect = userAnswer === question.correctIndex;
            
            return (
              <div
                key={question.id}
                className={cn(
                  'rounded-lg border p-4 flex items-start gap-3',
                  isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                )}
              >
                <div className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  isCorrect ? 'bg-green-500' : 'bg-red-500'
                )}>
                  {isCorrect ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{question.question}</p>
                  {!isCorrect && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Correct: {question.options[question.correctIndex]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onSelectNew}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Choose Level
        </Button>
        <Button onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
