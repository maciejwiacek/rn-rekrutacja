import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import CalendarDay from './CalendarDay'

import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)
dayjs.extend(localeData)
dayjs.extend(customParseFormat)
dayjs.locale('pl')

export interface WeekViewProps {
  from: dayjs.Dayjs
  offerDays: string[]
  orderDays: string[]
}

export interface MonthDay {
  day: string
  date: string
  today: boolean
  offer: boolean
  order: boolean
  isCurrentMonth: boolean
}

// TODO: use color theme
const blue = '#0070ff'
const lightBlue = '#4688eb'
const orange = '#ffaa2a'

export const DayFormat = 'YYYY-MM-DD'

export default function MonthView({
  from,
  orderDays,
  offerDays,
}: WeekViewProps) {
  const [width, setWidth] = useState<number>(0)
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(from)
  const [selectedDate, setSelectedDate] = useState<MonthDay | null>(null)

  const monthStart = dayjs(currentMonth).startOf('month')
  const monthEnd = dayjs(currentMonth).endOf('month')

  const firstMonday = dayjs(monthStart).startOf('week')
  const lastSunday = dayjs(monthEnd).endOf('week')

  let day = firstMonday
  const days: MonthDay[] = []

  while (day.isSameOrBefore(lastSunday)) {
    days.push({
      day: day.format('DD'),
      date: day.format(DayFormat),
      today: day.isSame(dayjs(), 'day'),
      offer: offerDays.includes(day.format(DayFormat)),
      order: orderDays.includes(day.format(DayFormat)),
      isCurrentMonth: day.isSame(currentMonth, 'month'),
    })

    day = day.add(1, 'day')
  }

  const weeks: MonthDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const monthTitle = monthStart.format('MMMM YYYY')
  const monthTitleCapitalized =
    monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1)

  const sendOrder = async () => {
    if (!selectedDate) return

    try {
      const response = await fetch('https://example.com/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      Alert.alert(
        'Order placed',
        `Your order for ${data.date} has been placed successfully!`
      )
    } catch (error) {
      console.log('Order error:', error)
      Alert.alert(
        'Order failed',
        'There was an error placing your order. Please try again later.'
      )
    }

    setSelectedDate(null)
  }

  return (
    <View
      style={styles.days}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* Calendar header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
        >
          <FontAwesome
            name='chevron-left'
            size={16}
            color='#fff'
            style={{ marginRight: 1 }}
          />
        </TouchableOpacity>
        <ThemedText style={styles.monthTitle}>
          {monthTitleCapitalized}
        </ThemedText>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))}
        >
          <FontAwesome
            name='chevron-right'
            size={16}
            color='#fff'
            style={{ marginLeft: 3 }}
          />
        </TouchableOpacity>
      </View>

      {/* Week day header */}
      <View style={styles.weekHeader}>
        {weekDayNames.map((dayName) => (
          <View
            key={dayName}
            style={{
              width: width / 7,
              padding: 2,
            }}
          >
            <ThemedText style={styles.weekDayName}>{dayName[0]}</ThemedText>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <View key={`week-${week[0]?.date || weekIndex}`} style={styles.weekRow}>
          {week.map((d) => (
            <View
              style={{
                ...{
                  width: width / 7,
                  padding: 1,
                },
              }}
              key={d.date}
            >
              <CalendarDay
                d={d}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </View>
          ))}
        </View>
      ))}

      {/* Selected date details */}
      {selectedDate && (
        <View style={styles.selectedDateDetails}>
          <ThemedText style={styles.selectedDateText}>
            {dayjs(selectedDate.date).format('DD MMMM YYYY')}
          </ThemedText>
          <TouchableOpacity style={styles.orderButton} onPress={sendOrder}>
            <ThemedText style={styles.orderButtonText}>Zamów</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  status: {
    position: 'absolute',
    borderRadius: 5,
    width: 15,
    aspectRatio: 1,
  },
  unavailable: {
    opacity: 0.5,
  },
  ordered: {
    top: -3,
    right: -3,
    backgroundColor: lightBlue,
  },
  orderedUnpaid: {
    top: -3,
    right: -3,
    backgroundColor: orange,
  },
  cancelled: {
    bottom: -3,
    left: -3,
    backgroundColor: '#666',
  },
  added: {
    bottom: -3,
    right: -3,
    backgroundColor: blue,
  },
  orderedText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'poppins-bold',
    color: '#fff',
  },
  days: {
    marginVertical: 2,
    marginHorizontal: 2,
    alignSelf: 'stretch',
  },
  weekHeader: {
    flexDirection: 'row',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekDayName: {
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'poppins-bold',
    textTransform: 'uppercase',
    fontSize: 8,
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: blue,
  },
  today: {
    color: '#555',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  monthButton: {
    backgroundColor: lightBlue,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  selectedDateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: blue,
  },
  orderButton: {
    backgroundColor: lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})
