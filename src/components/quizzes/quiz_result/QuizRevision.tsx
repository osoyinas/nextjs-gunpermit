'use client'

import { useSetupQuiz } from '@/hooks/make-quiz/useSetupQuiz'
import { useMakeQuizQuestions } from '@/hooks/make-quiz/useMakeQuizQuestions'
import { FullscreenLoading } from '@/components/FullscreenLoading'
import { AnimatedQuizResultQuestion } from './QuizQuestionResult'
import { useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useMakeQuiz } from '@/hooks/make-quiz/useMakeQuiz'
import { ResultInfo } from './ResultInfo'
import { QuizResult } from '@/types/Quizzes'
import { CopyToSaveMessage } from './CopyToSaveMessage'
import { useSetupQuizResult } from '@/hooks/quiz_result/useSetupQuizResult'

interface MakeQuizProps {
  quizId: number;
}
export function QuizRevision (props: MakeQuizProps) {
  const { quizId } = props
  const { loading } = useSetupQuiz(quizId)
  const { actualQuestion } = useMakeQuizQuestions()

  const { quizResult } = useSetupQuizResult()

  if (loading || !quizResult) {
    return <FullscreenLoading />
  }

  return (
    <>
      <ResultInfo quizResult={quizResult} />
      <AnimatedQuizResultQuestion question={actualQuestion} />
      <CopyToSaveMessage />
    </>
  )
}
