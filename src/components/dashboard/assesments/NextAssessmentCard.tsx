'use client'
import { CalendarIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../../ui/card'
import { useEffect, useState } from 'react'
import { Assessment, Place } from '@/types/Assessments'
import { useAssessments } from '@/hooks/api/assessments/useAssessments'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import useAssessmentLocalStorage from '@/hooks/assessments/useAssessmentLocalStorage'
import { Skeleton } from '../../ui/skeleton'
import { DetailsButton } from '@/components/dashboard/assesments/DetailsButton'
import { TypographyMuted } from '@components/typography/TypographyMuted'
import AddToCalendarButton from '@/components/dashboard/assesments/AddToCalendarButton'
import { TimeAgoComponent } from '../results/TimeAgoComponent'
import { useSession } from 'next-auth/react'

export function NextAssessmentCard () {
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [places, setPlaces] = useState<Place[] | null>(null)
  const {
    selectedPlace: selectedPlaceId,
    setSelectedPlace: setSelectedPlaceId
  } = useAssessmentLocalStorage()
  const { getPlaces, getNextAssessment } = useAssessments()

  const [loadingNextAssessment, setLoadingNextAssessment] = useState(true)
  const { status } = useSession()
  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await getPlaces()
      if (response.ok) {
        const newPlaces = response.val
        setPlaces(newPlaces)
      }
    }
    fetchPlaces()
  }, [status])

  useEffect(() => {
    if (places == null) return
    const selectedPlaceExists = places.some((place) => {
      return place.id === selectedPlaceId
    })
    if ((selectedPlaceId == null || !selectedPlaceExists) && places.length > 0) {
      setSelectedPlaceId(places[0].id)
    }
  }, [selectedPlaceId, places])

  useEffect(() => {
    if (places == null || selectedPlaceId == null) return
    setLoadingNextAssessment(true)
    const fetchNextAssessment = async () => {
      const response = await getNextAssessment(selectedPlaceId)
      if (response.ok) {
        setAssessment(response.val)
      }
      setLoadingNextAssessment(false)
    }
    fetchNextAssessment()
  }, [selectedPlaceId, places])

  const handlePlaceChange = (placeId: string) => {
    setSelectedPlaceId(parseInt(placeId))
  }

  if (assessment == null || places == null) {
    return (
      <Card className='h-96'>
        <CardHeader>
          <CardTitle>Próxima Prueba</CardTitle>
          <CardDescription>Información sobre tu próximo examen</CardDescription>
        </CardHeader>
        <CardContent>
        <div className='w-full h-64'>
          <Skeleton className="w-full h-full" />
        </div>
        </CardContent>
      </Card>
    )
  }
  const localeDateString = new Date(assessment.date).toLocaleDateString()
  const date = new Date(assessment.date)

  const selectedPlaceName = places.find((place) => {
    return place.id === selectedPlaceId
  })?.name

  return (
    <Card className='h-96'>
      <CardHeader>
        <CardTitle>Próxima Prueba</CardTitle>
        <CardDescription>Información sobre tu próximo examen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select
            onValueChange={handlePlaceChange}
            value={selectedPlaceId?.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleciona Ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Comandancias</SelectLabel>
                {places.map((place, index) => (
                  <SelectItem key={index} value={place.id.toString()}>
                    {place.province != null
                      ? `${place.name} - ${place.province}`
                      : place.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-medium">Fecha del Examen</p>
            {loadingNextAssessment
              ? (
              <Skeleton className="w-24 h-12" />
                )
              : (
              <div>
                <p className="text-lg">
                  <span className="font-bold">{localeDateString}</span>
                </p>
                <TypographyMuted>
                  <TimeAgoComponent date={new Date(assessment.date)} />
                </TypographyMuted>
              </div>
                )}
          </div>
        </div>
        <br />
        <br />
        <DetailsButton className="w-full" />
        <AddToCalendarButton
          className="w-full"
          title="Examen para Licencia de armas de caza (D, E, AEM)"
          startDate={date}
          details="Licencia de armas de caza (D, E, AEM)"
          location={`Comandancia de la Guardia Civil, ${
            selectedPlaceName ?? ''
          } `}
        />
      </CardContent>
    </Card>
  )
}
