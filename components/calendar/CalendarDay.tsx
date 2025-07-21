import { Pressable, StyleSheet, View } from 'react-native'
import { ThemedText } from '../ThemedText'
import { MonthDay } from './Calendar'

const blue = '#0070ff'
const lightBlue = '#4688eb'

interface CalendarDayProps {
  d: MonthDay
  selectedDate: MonthDay | null
  setSelectedDate: React.Dispatch<React.SetStateAction<MonthDay | null>>
}

const CalendarDay = ({
  d,
  selectedDate,
  setSelectedDate,
}: CalendarDayProps) => {
  return (
    <Pressable
      style={{
        ...styles.touchableBox,
        ...(d.offer || !d.isCurrentMonth ? {} : styles.noOfferDay),
        ...(d.isCurrentMonth ? {} : styles.otherMonthDay),
        ...(d.today && d.isCurrentMonth ? styles.todayBackground : {}),
        ...(selectedDate?.date === d.date
          ? { backgroundColor: lightBlue }
          : {}),
      }}
      onPress={() => {
        const isSelected = selectedDate?.date === d.date
        const isSelectable = d.isCurrentMonth && (d.offer || d.order)

        if (isSelected || !isSelectable) {
          setSelectedDate(null)
        } else {
          setSelectedDate(d)
        }
      }}
    >
      <View style={styles.dayBox}>
        {d.isCurrentMonth && (
          <ThemedText
            style={{
              ...styles.dayText,
              ...(d.today ? { fontWeight: 'bold', color: blue } : {}),
              ...(d.isCurrentMonth ? {} : styles.otherMonthText),
            }}
          >
            {d.day}
          </ThemedText>
        )}
      </View>
    </Pressable>
  )
}

export default CalendarDay

const styles = StyleSheet.create({
  touchableBox: {
    backgroundColor: '#f6f6f6',
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f6f6f6',
    justifyContent: 'center',
  },
  noOfferDay: {
    opacity: 0.4,
  },
  otherMonthDay: {
    backgroundColor: '#f0f0f0',
    borderColor: '#f0f0f0',
    opacity: 0.4,
  },
  todayBackground: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: blue,
  },
  dayBox: {
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  otherMonthText: {
    color: '#ccc',
  },
  dayText: {
    textAlign: 'center',
    fontSize: 13,
  },
})
