export default class dateTimePicker {
  constructor(element) {
    this.element = element
    this.dateTimePickerContainer = document.createElement('div')
    this.dateTimeContent = document.createElement('div')
    this.datePickerContainer = document.createElement('div')
    this.timePickerContainer = document.createElement('div')
    this.actionContainer = document.createElement('div')
    this.actionButton = document.createElement('button')
    this.iconCalendar = document.createElement('i')

    // DatePicker Content
    this.datePickerHeader = document.createElement('div')
    this.contentContainer = document.createElement('div')
    this.dateContent = document.createElement('div')
    this.monthContent = document.createElement('div')
    this.yearContent = document.createElement('div')
    this.currentYearElement = document.createElement('span')
    this.currentMonthElement = document.createElement('span')
    this.prevMonthButton = document.createElement('button')
    this.nextMonthButton = document.createElement('button')
    this.selectedDate = new Date()
    this.currentDate = new Date()
    this.currentMonth = this.currentDate.getMonth()
    this.currentYear = this.currentDate.getFullYear()

    // Timepicker Content
    this.timePickerContent = document.createElement('div')
    this.timeHourList = document.createElement('div')
    this.timeMinuteList = document.createElement('div')
    this.timeSecondList = document.createElement('div')

    setupDatePicker(this)
    setupTimePicker(this)
    setupCustomElement(this)
    setupEventListeners(this)

    element.after(this.dateTimePickerContainer)
  }

  // Date Picker Functions
  goToNextMonth = () => {
    this.currentMonth = (this.currentMonth + 1) % 12
    if (this.currentMonth === 0) {
      this.currentYear++
    }
    this.updateCalendar()
  }

  goToPreviousMonth = () => {
    this.currentMonth = (this.currentMonth - 1 + 12) % 12
    if (this.currentMonth === 11) {
      this.currentYear--
    }
    this.updateCalendar()
  }

  createDatePickerHeader() {
    this.datePickerHeader.classList.add('datetime-datepicker-header')
    this.datePickerContainer.append(this.datePickerHeader)

    const createButton = (button, iconClass, clickHandler) => {
      button.setAttribute('type', 'button')
      button.classList.add('datetime-datepicker-button', 'show')
      button.addEventListener('click', clickHandler)
      this.datePickerHeader.appendChild(button)

      const icon = document.createElement('i')
      icon.classList.add('bi', iconClass)
      button.appendChild(icon)
    }

    createButton(
      this.prevMonthButton,
      'bi-chevron-left',
      this.goToPreviousMonth
    )

    const currentDateElement = document.createElement('div')
    currentDateElement.classList.add('datetime-current-date-container')
    this.datePickerHeader.appendChild(currentDateElement)

    this.currentMonthElement.classList.add('datetime-current-month-label')
    currentDateElement.appendChild(this.currentMonthElement)

    this.currentYearElement.classList.add('datetime-current-year-label')
    currentDateElement.appendChild(this.currentYearElement)

    createButton(this.nextMonthButton, 'bi-chevron-right', this.goToNextMonth)

    this.currentMonthElement.addEventListener('click', () => {
      this.monthContent.classList.add('show')
      this.dateContent.classList.remove('show')
      this.yearContent.classList.remove('show')
      this.toggleMonthButtons()
    })

    this.currentYearElement.addEventListener('click', () => {
      this.yearContent.classList.add('show')
      this.monthContent.classList.remove('show')
      this.dateContent.classList.remove('show')
      this.toggleMonthButtons()

      const selectedYearElement = this.yearContent.querySelector(
        '.datepicker-year-item.selected'
      )
      selectedYearElement.scrollIntoView({ behavior: 'auto', block: 'center' })
    })
  }

  updateCalendar() {
    this.dateContent.innerHTML = ''

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    dayNames.forEach((dayName) => {
      const dayElement = document.createElement('div')
      dayElement.classList.add('day-name')
      dayElement.textContent = dayName
      this.dateContent.appendChild(dayElement)
    })

    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate()

    const firstDayOfMonth = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).getDay()

    const daysInPreviousMonth = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate()

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayElement = document.createElement('div')
      dayElement.classList.add('datepicker-day-item', 'date-disabled')
      dayElement.textContent = daysInPreviousMonth - i
      this.dateContent.appendChild(dayElement)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = this.createDayElement('datepicker-day-item', day)

      if (
        day === this.selectedDate.getDate() &&
        this.currentMonth === this.selectedDate.getMonth() &&
        this.currentYear === this.selectedDate.getFullYear()
      ) {
        dayElement.classList.add('selected')
      }

      dayElement.addEventListener('click', (event) => {
        this.selectDate(day, event)
      })

      this.dateContent.appendChild(dayElement)
    }

    const daysInNextMonth = 6 * 7 - (firstDayOfMonth + daysInMonth)
    for (let day = 1; day <= daysInNextMonth; day++) {
      const dayElement = document.createElement('div')
      dayElement.classList.add('datepicker-day-item', 'date-disabled')
      dayElement.textContent = day
      this.dateContent.appendChild(dayElement)
    }

    this.currentMonthElement.textContent = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).toLocaleString('default', { month: 'long' })
    this.currentYearElement.textContent = this.currentYear

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    this.monthContent.innerHTML = ''
    monthNames.forEach((month, index) => {
      const monthElement = document.createElement('div')
      monthElement.classList.add('datepicker-month-item')
      monthElement.textContent = month
      monthElement.setAttribute('data-month', index)

      if (
        index === this.selectedDate.getMonth() &&
        this.currentYear === this.selectedDate.getFullYear()
      ) {
        monthElement.classList.add('selected')
      }

      monthElement.addEventListener('click', (event) => {
        this.selectMonth(index, event)
      })

      this.monthContent.appendChild(monthElement)
    })
  }

  selectMonth(monthIndex, event) {
    this.currentMonth = monthIndex
    this.updateCalendar()

    const selectedMonthElement = this.monthContent.querySelector(
      '.datepicker-month-item.selected'
    )
    if (selectedMonthElement) {
      selectedMonthElement.classList.remove('selected')
    }
    const newSelectedMonthElement = this.monthContent.querySelector(
      `.datepicker-month-item[data-month="${monthIndex}"]`
    )
    if (newSelectedMonthElement) {
      newSelectedMonthElement.classList.add('selected')
    }

    this.monthContent.classList.remove('show')
    this.dateContent.classList.add('show')

    this.currentMonthElement.textContent = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).toLocaleString('default', { month: 'long' })

    if (event) {
      event.stopPropagation()
    }

    this.toggleMonthButtons()
  }

  createDayElement(className, textContent) {
    const dayElement = document.createElement('div')
    dayElement.classList.add('datepicker-day-item', className)
    dayElement.textContent = textContent
    dayElement.setAttribute('data-day', textContent)
    return dayElement
  }

  toggleMonthButtons() {
    const isMonthContentShown =
      this.monthContent.classList.contains('show') ||
      this.yearContent.classList.contains('show')

    this.prevMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
    this.nextMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
  }

  updateYearContent() {
    const startYear = 1900
    const endYear = 2100
    const selectedYear = this.currentYear

    this.yearContent.innerHTML = ''

    for (let year = startYear; year <= endYear; year++) {
      const yearElement = document.createElement('div')
      yearElement.classList.add('datepicker-year-item')
      yearElement.textContent = year
      yearElement.setAttribute('data-year', year)

      if (year === selectedYear) {
        yearElement.classList.add('selected')
      }

      yearElement.addEventListener('click', (event) => {
        this.selectYear(year, event)
      })

      this.yearContent.appendChild(yearElement)
    }
  }

  selectYear(year, event) {
    if (event) {
      event.stopPropagation()
    }

    this.currentYear = year
    this.updateCalendar()

    this.yearContent.classList.remove('show')
    this.dateContent.classList.add('show')
    this.monthContent.classList.remove('show')
    this.toggleMonthButtons()

    this.currentYearElement.textContent = year

    const selectedYearElement = this.yearContent.querySelector(
      '.datepicker-year-item.selected'
    )
    if (selectedYearElement) {
      selectedYearElement.classList.remove('selected')
    }

    const newSelectedYearElement = this.yearContent.querySelector(
      `.datepicker-year-item[data-year="${year}"]`
    )
    if (newSelectedYearElement) {
      newSelectedYearElement.classList.add('selected')
    }
  }

  selectDate(day, event) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day)
    const isElementEmpty = !this.element.value.trim()

    if (isElementEmpty) {
      this.selectTime(0, 0, 0)
    } else {
      selectedDate.setHours(
        this.selectedDate.getHours(),
        this.selectedDate.getMinutes(),
        this.selectedDate.getSeconds()
      )
    }

    this.selectedDate = selectedDate

    this.updateInputValue()

    this.highlightSelectedDate(day)

    if (event) {
      event.stopPropagation()
    }

    if (isElementEmpty) {
      this.selectTime(0, 0, 0)
    }
  }

  highlightSelectedDate(day) {
    const selectedDateElement = this.dateContent.querySelector(
      '.datepicker-day-item.selected'
    )

    if (selectedDateElement) {
      selectedDateElement.classList.remove('selected')
    }

    const newSelectedDateElement = this.dateContent.querySelector(
      `.datepicker-day-item[data-day="${day}"]`
    )

    if (newSelectedDateElement) {
      newSelectedDateElement.classList.add('selected')
    }
  }

  // Time Picker Functions

  populateTimeList(container, maxValue, unit) {
    for (let i = 0; i < maxValue; i++) {
      const item = document.createElement('div')
      item.classList.add(`time-item-${unit}`)
      item.textContent = i < 10 ? `0${i}` : `${i}`
      const formattedValue = i < 10 ? `0${i}` : `${i}`
      item.setAttribute(`data-${unit}`, formattedValue)
      container.appendChild(item)

      item.addEventListener('click', () => {
        const hourElement = this.timeHourList.querySelector(
          '.time-item-hour.selected'
        )
        const minuteElement = this.timeMinuteList.querySelector(
          '.time-item-minute.selected'
        )
        const secondElement = this.timeSecondList.querySelector(
          '.time-item-second.selected'
        )

        if (!hourElement && !minuteElement && !secondElement) {
          switch (unit) {
            case 'hour':
              this.selectTime(
                unit === 'hour'
                  ? parseInt(formattedValue)
                  : this.selectedDate.getHours(),
                0,
                0
              )
              break
            case 'minute':
              this.selectTime(
                0,
                unit === 'minute'
                  ? parseInt(formattedValue)
                  : this.selectedDate.getHours(),
                0
              )
              break
            case 'second':
              this.selectTime(
                0,
                0,
                unit === 'second'
                  ? parseInt(formattedValue)
                  : this.selectedDate.getHours()
              )
              break
          }
        } else {
          this.selectTime(
            unit === 'hour'
              ? parseInt(formattedValue)
              : this.selectedDate.getHours(),
            unit === 'minute'
              ? parseInt(formattedValue)
              : this.selectedDate.getMinutes(),
            unit === 'second'
              ? parseInt(formattedValue)
              : this.selectedDate.getSeconds()
          )
        }
      })
    }
  }

  selectTime(hour, minute, second) {
    this.selectedDate.setHours(hour, minute, second)

    this.updateInputValue()

    this.highlightSelectedTime(hour, minute, second)
  }

  updateInputValue() {
    // Format the selected date and time
    const formattedDateTime = this.selectedDate.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    })

    // Update the input value
    this.element.value = formattedDateTime.replace(/,/g, '')
  }

  highlightSelectedTime(hour, minute, second) {
    this.highlightTimeItem(this.timeHourList, 'hour', hour)
    this.highlightTimeItem(this.timeMinuteList, 'minute', minute)
    this.highlightTimeItem(this.timeSecondList, 'second', second)
  }

  highlightTimeItem(container, unit, value) {
    container
      .querySelectorAll(`.time-item-${unit}`)
      .forEach((item) => item.classList.remove('selected'))

    const formattedValue = value < 10 ? `0${value}` : `${value}`
    const selectedTimeItem = container.querySelector(
      `.time-item-${unit}[data-${unit}="${formattedValue}"]`
    )

    if (selectedTimeItem) {
      selectedTimeItem.classList.add('selected')
    }
  }
}

function setupCustomElement(dateTimePicker) {
  const dateTimePickerContainer = dateTimePicker.element.parentNode
  dateTimePickerContainer.classList.add('icon')

  dateTimePicker.iconCalendar.classList.add('dfn-icon', 'bi', 'bi-calendar')
  dateTimePicker.element.insertAdjacentElement('afterend', dateTimePicker.iconCalendar)

  dateTimePicker.dateTimePickerContainer.classList.add(
    'datetime-element-container'
  )
  
  dateTimePicker.dateTimeContent.classList.add('datetime-content')
  dateTimePicker.dateTimePickerContainer.append(dateTimePicker.dateTimeContent)

  dateTimePicker.dateTimeContent.appendChild(dateTimePicker.datePickerContainer)
  dateTimePicker.datePickerContainer.classList.add(
    'datetimepicker-datepicker-container'
  )

  dateTimePicker.dateTimeContent.appendChild(dateTimePicker.timePickerContainer)
  dateTimePicker.timePickerContainer.classList.add(
    'datetimepicker-timepicker-container'
  )

  dateTimePicker.actionContainer.classList.add('datetime-action-container')
  dateTimePicker.dateTimePickerContainer.append(dateTimePicker.actionContainer)

  dateTimePicker.actionButton.classList.add(
    'datetime-action-button',
    'dfn-button',
    'sm'
  )
  dateTimePicker.actionButton.textContent = 'Ok'
  dateTimePicker.actionContainer.append(dateTimePicker.actionButton)

  const initialDateTimeValue = dateTimePicker.element.value
  const dateTimeValueitem = initialDateTimeValue.split(' ')

  if (dateTimeValueitem.length === 2) {
    const dateValueitem = dateTimeValueitem[0].split('/')
    const timeValueitem = dateTimeValueitem[1].split(':')

    const day = parseInt(dateValueitem[0], 10)
    const month = parseInt(dateValueitem[1], 10) - 1
    const year = parseInt(dateValueitem[2], 10)

    const hour = parseInt(timeValueitem[0], 10)
    const minute = parseInt(timeValueitem[1], 10)
    const second = parseInt(timeValueitem[2], 10)

    const currentDateValue = new Date(year, month, day)
    dateTimePicker.selectedDate = currentDateValue
    dateTimePicker.currentMonth = month
    dateTimePicker.currentYear = year

    dateTimePicker.selectTime(hour, minute, second)

    dateTimePicker.updateCalendar()
    dateTimePicker.updateYearContent()
    dateTimePicker.populateTimeList(dateTimePicker.timeHourList, 24, 'hour')
    dateTimePicker.populateTimeList(dateTimePicker.timeMinuteList, 60, 'minute')
    dateTimePicker.populateTimeList(dateTimePicker.timeSecondList, 60, 'second')

    // Scroll into view is still not working
    const hourElement = dateTimePicker.timeHourList.querySelector(
      `[data-hour="${timeValueitem[0]}"]`
    )
    const minuteElement = dateTimePicker.timeMinuteList.querySelector(
      `[data-minute="${timeValueitem[1]}"]`
    )
    const secondElement = dateTimePicker.timeSecondList.querySelector(
      `[data-second="${timeValueitem[2]}"]`
    )
    hourElement.scrollIntoView({ behavior: 'auto', block: 'start' })
    minuteElement.scrollIntoView({ behavior: 'auto', block: 'start' })
    secondElement.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

function setupDatePicker(dateTimePicker) {
  dateTimePicker.createDatePickerHeader()

  dateTimePicker.contentContainer.classList.add('datetime-datepicker-content')
  dateTimePicker.datePickerContainer.appendChild(
    dateTimePicker.contentContainer
  )

  dateTimePicker.dateContent.classList.add('datepicker-day-content', 'show')
  dateTimePicker.contentContainer.appendChild(dateTimePicker.dateContent)

  dateTimePicker.monthContent.classList.add('datepicker-month-content')
  dateTimePicker.contentContainer.appendChild(dateTimePicker.monthContent)

  dateTimePicker.yearContent.classList.add('datepicker-year-content')
  dateTimePicker.contentContainer.appendChild(dateTimePicker.yearContent)

  dateTimePicker.updateCalendar()
  dateTimePicker.updateYearContent()
}

function setupTimePicker(dateTimePicker) {
  dateTimePicker.timePickerContainer.classList.add(
    'datetime-timepicker-container'
  )
  dateTimePicker.timePickerContent.classList.add('datetime-timepicker-content')
  dateTimePicker.timePickerContainer.appendChild(
    dateTimePicker.timePickerContent
  )

  dateTimePicker.timeHourList.classList.add('datetime-time-hour-list')
  dateTimePicker.timePickerContent.appendChild(dateTimePicker.timeHourList)

  dateTimePicker.timeMinuteList.classList.add('datetime-time-minute-list')
  dateTimePicker.timePickerContent.appendChild(dateTimePicker.timeMinuteList)

  dateTimePicker.timeSecondList.classList.add('datetime-time-second-list')
  dateTimePicker.timePickerContent.appendChild(dateTimePicker.timeSecondList)

  dateTimePicker.populateTimeList(dateTimePicker.timeHourList, 24, 'hour')
  dateTimePicker.populateTimeList(dateTimePicker.timeMinuteList, 60, 'minute')
  dateTimePicker.populateTimeList(dateTimePicker.timeSecondList, 60, 'second')
}

function setupEventListeners(dateTimePicker) {
  dateTimePicker.element.addEventListener('click', (event) => {
    event.stopPropagation()
    dateTimePicker.dateTimePickerContainer.classList.toggle('show')
  })

  document.addEventListener('click', (event) => {
    const isClickedOutside = !dateTimePicker.dateTimePickerContainer.contains(
      event.target
    )
    if (isClickedOutside) {
      dateTimePicker.dateTimePickerContainer.classList.remove('show')
    }
  })

  dateTimePicker.actionButton.addEventListener('click', () => {
    dateTimePicker.dateTimePickerContainer.classList.remove('show')
  })
}
