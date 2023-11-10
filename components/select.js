export default class Select {
  constructor(element) {
    this.element = element
    this.options = getFormattedOptions(element.querySelectorAll('option'))
    this.customElement = document.createElement('div')
    this.labelElement = document.createElement('span')
    this.optionsCustomElement = document.createElement('ul')
    this.customPlaceholder = element.getAttribute('data-placeholder')

    setupCustomElement(this)
    if (element.disabled) {
      this.customElement.classList.add('disabled')
      this.customElement.removeAttribute('tabIndex')
    }
    element.style.display = 'none'
    element.after(this.customElement)
  }

  get selectedOption() {
    return this.options.find((option) => option.selected)
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption)
  }

  selectValue(value) {
    const newSelectedOption = this.options.find((option) => {
      return option.value === value
    })

    const prevSelectedOption = this.selectedOption

    if (this.labelElement.innerText !== this.customPlaceholder) {
      prevSelectedOption.selected = false
      prevSelectedOption.element.selected = false
      this.optionsCustomElement
      .querySelector(`[data-value="${prevSelectedOption.value}"]`)
      .classList.remove('selected')
    }
    newSelectedOption.selected = true
    newSelectedOption.element.selected = true

    this.labelElement.innerText = newSelectedOption.label
    const newCustomElement = this.optionsCustomElement.querySelector(
      `[data-value="${newSelectedOption.value}"]`
    )
    newCustomElement.classList.add('selected')
    newCustomElement.scrollIntoView({ block: 'nearest' })
  }
}

function setupCustomElement(select) {
  select.customElement.classList.add('select-input-container')
  select.customElement.tabIndex = 0

  select.labelElement.classList.add('select-input-value')
  select.customElement.append(select.labelElement)

  if (select.customPlaceholder) {
    select.labelElement.innerText = select.customPlaceholder
    select.labelElement.classList.toggle(
      'custom-placeholder',
      select.customPlaceholder
    )

    select.selectedOption.selected = false
  } else {
    select.labelElement.innerText = select.selectedOption.value
  }

  select.optionsCustomElement.classList.add('select-input-options')
  select.options.forEach((option) => {
    const optionElement = document.createElement('li')
    optionElement.classList.add('select-input-option')
    optionElement.classList.toggle('selected', option.selected)
    optionElement.classList.toggle('disabled', option.disabled)
    optionElement.innerText = option.label
    optionElement.dataset.value = option.value
    optionElement.dataset.disabled = option.disabled ? 'true' : 'false'

    optionElement.addEventListener('click', () => {
      select.selectValue(option.value)
      select.labelElement.classList.remove('custom-placeholder')
      select.optionsCustomElement.classList.remove('show')
    })
    select.optionsCustomElement.append(optionElement)
  })
  select.customElement.append(select.optionsCustomElement)

  select.labelElement.addEventListener('click', () => {
    select.optionsCustomElement.classList.toggle('show')
  })

  select.customElement.addEventListener('blur', () => {
    select.optionsCustomElement.classList.remove('show')
  })

  let debounceTimeout
  let searchTerm = ''
  select.customElement.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'Space':
        select.optionsCustomElement.classList.toggle('show')
        break
      case 'ArrowUp': {
        const prevOption = select.findPreviousEnabledOption()
        if (prevOption) {
          select.selectValue(prevOption.value)
          select.labelElement.classList.remove('custom-placeholder')
        }
        break
      }
      case 'ArrowDown': {
        const nextOption = select.findNextEnabledOption()
        if (nextOption) {
          select.selectValue(nextOption.value)
          select.labelElement.classList.remove('custom-placeholder')
        }
        break
      }
      case 'Enter':
      case 'Escape':
        select.optionsCustomElement.classList.remove('show')
        break
      default: {
        clearTimeout(debounceTimeout)
        searchTerm += e.key
        debounceTimeout = setTimeout(() => {
          searchTerm = ''
        }, 500)

        const searchedOption = select.options.find((option) => {
          return option.label.toLowerCase().startsWith(searchTerm)
        })
        if (searchedOption) {
          select.selectValue(searchedOption.value)
        }
      }
    }
  })

  select.findPreviousEnabledOption = () => {
    for (let i = select.selectedOptionIndex - 1; i >= 0; i--) {
      if (!select.options[i].disabled) {
        return select.options[i]
      }
    }
    return null
  }

  select.findNextEnabledOption = () => {
    for (
      let i = select.selectedOptionIndex + 1;
      i < select.options.length;
      i++
    ) {
      if (!select.options[i].disabled) {
        return select.options[i]
      }
    }
    return null
  }
}

function getFormattedOptions(optionElements) {
  return [...optionElements].map((optionElement) => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      disabled: optionElement.disabled,
      element: optionElement,
    }
  })
}
