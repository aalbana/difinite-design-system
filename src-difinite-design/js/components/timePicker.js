export default class TimePicker {
  constructor(element) {
    this.element = element
    this.timePickerContainer = document.createElement('div')
    this.timePickerContent = document.createElement('div')
    this.timeHourList = document.createElement('div')
    this.timeMinuteList = document.createElement('div')
    this.timeSecondList = document.createElement('div')
    this.timePickerActionContainer = document.createElement('div')
    this.selectAction = document.createElement('button')

    setupCustomElement(this)
    setupEventListeners(this)

    element.after(this.timePickerContainer)
  }

  getSelectedTime() {
    const selectedHour = this.getSelectedHour()
    const selectedMinute = this.getSelectedMinute()
    const selectedSecond = this.getSelectedSecond()

    return `${selectedHour}:${selectedMinute}:${selectedSecond}`
  }

  getSelectedHour() {
    const selectedHourItem = this.timeHourList.querySelector(
      '.time-item-hour.selected'
    )

    return selectedHourItem ? selectedHourItem.textContent : null
  }

  getSelectedMinute() {
    const selectedMinuteItem = this.timeMinuteList.querySelector(
      '.time-item-minute.selected'
    )
    return selectedMinuteItem ? selectedMinuteItem.textContent : null
  }

  getSelectedSecond() {
    const selectedSecondItem = this.timeSecondList.querySelector(
      '.time-item-second.selected'
    )
    return selectedSecondItem ? selectedSecondItem.textContent : null
  }

  openTimePicker() {
    this.timePickerContainer.classList.toggle('show')
    if (this.timePickerContainer.classList.contains('show')) {
      this.setDefaultContent()
    }
  }

  closeTimePicker() {
    this.timePickerContainer.classList.remove('show')
  }

  setDefaultContent() {
    const elementValue = this.element.value

    if (elementValue && elementValue.match(/\d{2}:\d{2}:\d{2}/)) {
      const [hour, minute, second] = elementValue.split(':')
      selectTimeItem(this.timeHourList, parseInt(hour, 10), 'hour')
      selectTimeItem(this.timeMinuteList, parseInt(minute, 10), 'minute')
      selectTimeItem(this.timeSecondList, parseInt(second, 10), 'second')
    }

    const selectedHour = this.getSelectedHour() ? this.getSelectedHour() : '00'

    const selectedMinute = this.getSelectedMinute()
      ? this.getSelectedMinute()
      : '00'
    const selectedSecond = this.getSelectedSecond()
      ? this.getSelectedSecond()
      : '00'

    const hourElement = this.timeHourList.querySelector(
      `[data-hour="${selectedHour}"]`
    )
    const minuteElement = this.timeMinuteList.querySelector(
      `[data-minute="${selectedMinute}"]`
    )
    const secondElement = this.timeSecondList.querySelector(
      `[data-second="${selectedSecond}"]`
    )

    const zeroHourElement = this.timeHourList.querySelector(`[data-hour="00"]`)
    const zeroMinuteElement =
      this.timeMinuteList.querySelector(`[data-minute="00"]`)
    const zeroSecondElement =
      this.timeSecondList.querySelector(`[data-second="00"]`)

    console.log(zeroHourElement)

    if (!elementValue && hourElement && minuteElement && secondElement) {
      hourElement.classList.remove('selected')
      minuteElement.classList.remove('selected')
      secondElement.classList.remove('selected')

      console.log(elementValue)

      zeroHourElement.scrollIntoView({ behavior: 'auto', block: 'start' })
      zeroMinuteElement.scrollIntoView({ behavior: 'auto', block: 'start' })
      zeroSecondElement.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
     if (elementValue && hourElement && minuteElement && secondElement) {
      hourElement.scrollIntoView({ behavior: 'auto', block: 'start' })
      minuteElement.scrollIntoView({ behavior: 'auto', block: 'start' })
      secondElement.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  }

  populateTimeList(container, maxValue, unit, timePicker) {
    // Populate the time items
    for (let i = 0; i < maxValue; i++) {
      const item = document.createElement('div')
      item.classList.add(`time-item-${unit}`)
      item.textContent = i < 10 ? `0${i}` : `${i}`
      const formattedValue = i < 10 ? `0${i}` : `${i}`
      item.setAttribute(`data-${unit}`, formattedValue)
      container.appendChild(item)
    }

    // Add click event listener to each time item
    container.addEventListener('click', (event) => {
      const selectedTimeItem = event.target

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
        const selectedClass = 'selected'

        if (unit !== 'hour') {
          const hourContainer = document.querySelector('.time-hour-list')
          const zeroHourElement = hourContainer.querySelector(
            '.time-item-hour[data-hour="00"]'
          )
          zeroHourElement.classList.add(selectedClass)
        }

        if (unit !== 'minute') {
          const minuteContainer = document.querySelector('.time-minute-list')
          const zeroMinuteElement = minuteContainer.querySelector(
            '.time-item-minute[data-minute="00"]'
          )
          zeroMinuteElement.classList.add(selectedClass)
        }

        if (unit !== 'second') {
          const secondContainer = document.querySelector('.time-second-list')
          const zeroSecondElement = secondContainer.querySelector(
            '.time-item-second[data-second="00"]'
          )
          zeroSecondElement.classList.add(selectedClass)
        }
      }

      if (selectedTimeItem.classList.contains(`time-item-${unit}`)) {
        container.querySelectorAll(`.time-item-${unit}`).forEach((item) => {
          item.classList.remove('selected')
        })

        selectedTimeItem.classList.add('selected')
      }
    })
  }
}

function setupCustomElement(timePicker) {
  timePicker.timePickerContainer.classList.add('time-picker-container')
  timePicker.timePickerContent.classList.add('time-picker-content')
  timePicker.timePickerContainer.appendChild(timePicker.timePickerContent)

  timePicker.timeHourList.classList.add('time-hour-list')
  timePicker.timePickerContent.appendChild(timePicker.timeHourList)

  timePicker.timeMinuteList.classList.add('time-minute-list')
  timePicker.timePickerContent.appendChild(timePicker.timeMinuteList)

  timePicker.timeSecondList.classList.add('time-second-list')
  timePicker.timePickerContent.appendChild(timePicker.timeSecondList)

  timePicker.populateTimeList(timePicker.timeHourList, 24, 'hour')
  timePicker.populateTimeList(timePicker.timeMinuteList, 60, 'minute')
  timePicker.populateTimeList(timePicker.timeSecondList, 60, 'second')

  timePicker.timePickerActionContainer.classList.add(
    'time-picker-action-container'
  )
  timePicker.timePickerContainer.appendChild(
    timePicker.timePickerActionContainer
  )

  timePicker.selectAction.classList.add(
    'time-picker-action-button',
    'dfn-button',
    'sm'
  )
  timePicker.timePickerActionContainer.appendChild(timePicker.selectAction)
  timePicker.selectAction.textContent = 'Ok'
}

function setupEventListeners(timePicker) {
  timePicker.element.addEventListener('click', () => {
    timePicker.openTimePicker()
  })

  timePicker.selectAction.addEventListener('click', () => {
    const selectedTime = timePicker.getSelectedTime()
    timePicker.element.value = selectedTime
    timePicker.closeTimePicker()
  })

  document.addEventListener('click', (event) => {
    if (
      !timePicker.timePickerContainer.contains(event.target) &&
      event.target !== timePicker.element
    ) {
      timePicker.timePickerContainer.classList.remove('show')
    }
  })
}

function selectTimeItem(container, value, unit) {
  const timeItems = container.querySelectorAll(`.time-item-${unit}`)
  timeItems.forEach((item) => {
    if (parseInt(item.textContent, 10) === value) {
      item.classList.add('selected')
    } else {
      item.classList.remove('selected')
    }
  })
}
