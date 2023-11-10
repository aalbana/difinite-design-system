export default class MultipleSelect {
  constructor(element) {
    this.element = element
    this.options = getFormattedOptions(element.querySelectorAll('option'))
    this.customElement = document.createElement('div')
    this.selectedList = document.createElement('div')
    this.optionsCustomElement = document.createElement('ul')
    this.customPlaceholder = element.getAttribute('data-placeholder')
    this.placeholderElement = document.createElement('span')
    setupCustomElement(this)

    // element.style.display = 'none'
    element.after(this.customElement)
  }

  get selectedOptions() {
    return this.options.filter((option) => option.selected)
  }

  selectOption(value) {
    this.placeholderElement.style.display = 'none'
    const selectOption = this.options.find((option) => {
      return option.value === value
    })

    selectOption.selected = true
    selectOption.element.selected = true

    const newCustomElement = this.optionsCustomElement.querySelector(
      `[data-value="${selectOption.value}"]`
    )
    newCustomElement.classList.add('selected')
    newCustomElement.scrollIntoView({ block: 'nearest' })
  }

  unSelectOption(value) {
    const unSelectOption = this.options.find((option) => {
      return option.value === value
    })

    unSelectOption.selected = false
    unSelectOption.element.selected = false
    this.optionsCustomElement
      .querySelector(`[data-value="${unSelectOption.value}"]`)
      .classList.remove('selected')
  }

  createSelectedOptionElement(value) {
    const selectedValue = this.options.find((option) => {
      return option.value === value
    })

    const selectedOption = document.createElement('a')
    selectedOption.classList.add('option-selected')
    selectedOption.innerText = selectedValue.label
    this.selectedList.append(selectedOption)
    selectedOption.setAttribute('data-value', selectedValue.label)

    const deSelectedIcon = document.createElement('i')
    deSelectedIcon.classList.add('bi')
    deSelectedIcon.classList.add('bi-x')
    selectedOption.append(deSelectedIcon)

    selectedOption.addEventListener('click', (event) => {
      event.stopPropagation()
      this.removeSelectedOptionElement(selectedValue.value)
      this.unSelectOption(selectedValue.value)
    })
  }

  removeSelectedOptionElement(value) {
    const selectedValue = this.options.find((option) => {
      return option.value === value
    })

    const optionElement = this.selectedList.querySelector(
      `[data-value="${selectedValue.value}"]`
    )

    if (this.selectedOptions.length === 1) {
      this.placeholderElement.style.display = 'inline'
    }

    optionElement.remove()
  }
}

function setupCustomElement(multipleSelect) {
  multipleSelect.customElement.classList.add('multiple-select-container')
  multipleSelect.customElement.tabIndex = 0

  multipleSelect.selectedList.classList.add('multiple-select-value')
  multipleSelect.customElement.append(multipleSelect.selectedList)

  multipleSelect.placeholderElement.classList.add('custom-placeholder')
  multipleSelect.selectedList.append(multipleSelect.placeholderElement)

  if (multipleSelect.selectedOptions.length === 0) {
    if(multipleSelect.customPlaceholder){
      multipleSelect.placeholderElement.innerText = multipleSelect.customPlaceholder
    } else {
      multipleSelect.placeholderElement.innerText = 'Select option'
    }
  } else {
    multipleSelect.placeholderElement.style.display = 'none'
  }

  multipleSelect.options.forEach((option) => {
    if (option.selected) {
      multipleSelect.createSelectedOptionElement(option.value)
    }
  })

  multipleSelect.optionsCustomElement.classList.add('multiple-select-options')
  multipleSelect.options.forEach((option) => {
    const optionElement = document.createElement('li')
    optionElement.classList.add('multiple-select-option')
    optionElement.classList.toggle('selected', option.selected)
    optionElement.innerText = option.label
    optionElement.dataset.value = option.value

    multipleSelect.optionsCustomElement.append(optionElement)

    optionElement.addEventListener('click', () => {
      if (option.selected) {
        multipleSelect.removeSelectedOptionElement(option.value)
        multipleSelect.unSelectOption(option.value)
      } else {
        multipleSelect.selectOption(option.value)
        multipleSelect.createSelectedOptionElement(option.value)
      }
    })
  })

  multipleSelect.customElement.append(multipleSelect.optionsCustomElement)

  multipleSelect.selectedList.addEventListener('click', () => {
    multipleSelect.optionsCustomElement.classList.toggle('show')
  })

  multipleSelect.customElement.addEventListener('blur', () => {
    multipleSelect.optionsCustomElement.classList.remove('show')
  })
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
