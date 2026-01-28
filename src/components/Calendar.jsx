import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

function Calendar({ selectedDate, onSelectDate }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const { daysInMonth, firstDayOfMonth, prevMonthDays, today } = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        const prevDays = new Date(year, month, 0).getDate()
        const todayDate = new Date()

        return {
            daysInMonth,
            firstDayOfMonth: firstDay,
            prevMonthDays: prevDays,
            today: todayDate
        }
    }, [currentMonth])

    const goToPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (day) => {
        if (!selectedDate) return false
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        )
    }

    const handleDayClick = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        onSelectDate?.(newDate)
    }

    const formatSelectedDate = () => {
        if (!selectedDate) return ''
        return `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
    }

    // Generate calendar days
    const calendarDays = []

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevMonthDays - i,
            isOtherMonth: true
        })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
            day,
            isOtherMonth: false
        })
    }

    // Next month days
    const remainingDays = 42 - calendarDays.length
    for (let day = 1; day <= remainingDays; day++) {
        calendarDays.push({
            day,
            isOtherMonth: true
        })
    }

    return (
        <div className="glass-card calendar animate-fade-in">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button className="btn btn-ghost btn-icon" onClick={goToPrevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-medium">
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button className="btn btn-ghost btn-icon" onClick={goToNextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                {selectedDate && (
                    <span className="text-accent text-sm font-medium">
                        {formatSelectedDate()}
                    </span>
                )}
            </div>

            <div className="calendar-grid">
                {DAYS.map(day => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}

                {calendarDays.map((item, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${item.isOtherMonth ? 'other-month' : ''} ${!item.isOtherMonth && isToday(item.day) ? 'today' : ''
                            } ${!item.isOtherMonth && isSelected(item.day) ? 'selected' : ''}`}
                        onClick={() => !item.isOtherMonth && handleDayClick(item.day)}
                    >
                        {item.day}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Calendar
