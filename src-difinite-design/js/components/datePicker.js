export default class DatePicker {
  constructor(element) {
    this.element = element
    this.datePickerContainer = document.createElement('div')
    this.datePickerHeader = document.createElement('div')
    this.contentContainer = document.createElement('div')
    this.iconCalendar = document.createElement('i')
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
    const isMonthContentShown =
      this.monthContent.classList.contains('show') ||
      this.yearContent.classList.contains('show')

    this.prevMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
    this.nextMonthButton.style.display = isMonthContentShown ? 'none' : 'block'
  }

  openDatePicker() {
    this.setDefaultDateContent()
    this.datePickerContainer.classList.toggle('show')
  }

  setDefaultDateContent() {
    if (
      this.monthContent.classList.contains('show') ||
      this.yearContent.classList.contains('show')
    ) {
      this.yearContent.classList.remove('show')
      this.monthContent.classList.remove('show')
      this.dateContent.classList.add('show')
    }

    if (this.selectedDate) {
      this.currentMonthElement.textContent = new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ).toLocaleString('default', { month: 'long' })
      this.currentMonth = this.selectedDate.getMonth()
      this.currentYear = this.selectedDate.getFullYear()
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

    this.updateCalendar()
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

  closeDatePicker() {
    this.datePickerContainer.classList.remove('show')
  }
}

function setupCustomeElement(datePicker) {
  const datePickerContainer = datePicker.element.parentNode
  datePickerContainer.classList.add('icon')

  datePicker.iconCalendar.classList.add('dfn-icon', 'bi', 'bi-calendar')
  datePicker.element.insertAdjacentElement('afterend', datePicker.iconCalendar)

  datePicker.element.style.cursor = 'pointer'
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

  datePicker.dateContent.classList.add('datepicker-day-content', 'show')
  datePicker.contentContainer.append(datePicker.dateContent)

  datePicker.monthContent.classList.add('datepicker-month-content')
  datePicker.contentContainer.append(datePicker.monthContent)

  datePicker.yearContent.classList.add('datepicker-year-content')
  datePicker.contentContainer.append(datePicker.yearContent)

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
  datePicker.updateYearContent()
}
