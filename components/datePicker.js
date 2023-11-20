export default class DatePicker {
  constructor(element) {
    this.element = element
    this.datePickerContainer = document.createElement('div')
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

    setupCustomeElement(this)
    element.after(this.datePickerContainer)
  }

  goToNextMonth = () => {
    this.currentMonth = (this.currentMonth + 1) % 12
    if (this.currentMonth === 0) {
      this.currentYear++
    }
    this.updateCalendar()
  }

  goToPreviousMonth = () => {
    this.currentMonth = (this.currentMonth - 1) % 12
    if (this.currentMonth === 11) {
      this.currentYear--
    }
    this.updateCalendar()
  }

  selectDate(day, event) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day)
    const formattedDate = selectedDate.toLocaleDateString('en-GB')
    this.element.value = formattedDate
    this.selectedDate = selectedDate

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

    const selectedMonthIndex = selectedDate.getMonth()
    this.selectMonth(selectedMonthIndex, event)

    if (event) {
      event.stopPropagation()
    }

    this.closeDatePicker()
  }

  createDayElement(className, textContent) {
    const dayElement = document.createElement('div')
    dayElement.classList.add('datepicker-day-item', className)
    dayElement.textContent = textContent
    dayElement.setAttribute('data-day', textContent)
    return dayElement
  }

  toggleMonthButtons() {
    const isMonthContentShown = this.monthContent.classList.contains('show')
    this.prevMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
    this.nextMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
  }

  openDatePicker() {
    this.setDefaultDateContent()
    this.datePickerContainer.classList.toggle('show')
  }

  setDefaultDateContent() {
    if (this.monthContent.classList.contains('show')) {
      this.monthContent.classList.remove('show')
      this.dateContent.classList.add('show')
    }

    if (this.selectedDate) {
      this.currentMonthElement.textContent = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ).toLocaleString('default', { month: 'long' })
    }

    const selectedDayElement = this.dateContent.querySelector(
      `.datepicker-day-item[data-day="${this.selectedDate.getDate()}"]`
    )
    if (selectedDayElement) {
      selectedDayElement.classList.add('selected')
    }

    const selectedMonthElement = this.monthContent.querySelector(
      `.datepicker-month-item[data-month="${this.currentMonth}"]`
    )

    console.log(selectedMonthElement)

    if (selectedMonthElement) {
      selectedMonthElement.classList.add('selected')
    } else {
      const currentMonthElement = this.monthContent.querySelector(
        `.datepicker-month-item[data-month="${this.currentMonth}"]`
      )
      if (currentMonthElement) {
        currentMonthElement.classList.add('selected')
      }
    }

    this.toggleMonthButtons()
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

      monthElement.addEventListener('click', (event) => {
        this.selectMonth(index, event)
      })

      this.monthContent.appendChild(monthElement)
    })
  }

  selectMonth(monthIndex, event) {
    if (event) {
      event.stopPropagation()
    }

    this.currentMonth = monthIndex
    this.updateCalendar()

    this.monthContent.classList.remove('show')
    this.dateContent.classList.add('show')

    this.currentMonthElement.textContent = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).toLocaleString('default', { month: 'long' })

    this.toggleMonthButtons()
  }

  createDatePickerHeader() {
    this.datePickerHeader.classList.add('datepicker-header')
    this.datePickerContainer.append(this.datePickerHeader)
    const createButton = (button, iconClass, clickHandler) => {
      button.setAttribute('type', 'button')
      button.classList.add('datepicker-button', 'show')
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
    currentDateElement.classList.add('current-date-container')
    this.datePickerHeader.appendChild(currentDateElement)

    this.currentMonthElement.classList.add('current-month-label')
    currentDateElement.appendChild(this.currentMonthElement)

    this.currentYearElement.classList.add('current-year-label')
    currentDateElement.appendChild(this.currentYearElement)

    createButton(this.nextMonthButton, 'bi-chevron-right', this.goToNextMonth)

    this.currentMonthElement.addEventListener('click', () => {
      this.monthContent.classList.toggle('show')
      this.dateContent.classList.toggle('show')
      this.toggleMonthButtons()
    })
  }

  closeDatePicker() {
    this.datePickerContainer.classList.remove('show')
  }
}

function setupCustomeElement(datePicker) {
  datePicker.datePickerContainer.classList.add('datepicker-container')

  datePicker.element.addEventListener('click', () => {
    datePicker.openDatePicker()
  })

  document.addEventListener('click', (event) => {
    const isClickInsideDatePicker = datePicker.datePickerContainer.contains(
      event.target
    )
    const isClickInsideInput = datePicker.element.contains(event.target)

    if (!isClickInsideDatePicker && !isClickInsideInput) {
      datePicker.closeDatePicker()
    }
  })

  datePicker.createDatePickerHeader()

  datePicker.contentContainer.classList.add('datepicker-content')
  datePicker.datePickerContainer.append(datePicker.contentContainer)

  datePicker.dateContent.classList.add('datepicker-day-content')
  datePicker.dateContent.classList.add('show')
  datePicker.contentContainer.append(datePicker.dateContent)

  datePicker.monthContent.classList.add('datepicker-month-content')
  datePicker.contentContainer.append(datePicker.monthContent)

  const dateInput = datePicker.element

  dateInput.addEventListener('input', (event) => {
    let inputText = event.target.value.replace(/\D/g, '')
    if (inputText.length > 8) {
      inputText = inputText.slice(0, 8)
    }

    const formattedValue = inputText.replace(
      /(\d{2})(\d{2})(\d{4})/,
      '$1/$2/$3'
    )
    dateInput.value = formattedValue
  })

  datePicker.updateCalendar()
}
