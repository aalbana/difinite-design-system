// fileUpload.js
export default class FileUpload {
  constructor(element) {
    this.element = element
    this.customElement = document.createElement('button')
    this.listFileElement = document.createElement('div')
    setupCustomElement(this)
  }
}

function formatFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return size.toFixed(2) + ' ' + units[unitIndex]
}

function setupCustomElement(fileUpload) {
  const inputFile = fileUpload.element
  const customButton = fileUpload.customElement
  const listFileElement = fileUpload.listFileElement

  customButton.textContent = 'Upload file'
  customButton.classList.add('dfn-upload-button')
  inputFile.parentNode.insertBefore(customButton, inputFile.nextSibling)
  const uploadIcon = document.createElement('i')
  uploadIcon.classList.add('bi', 'bi-file-earmark-arrow-up-fill')
  customButton.append(uploadIcon, customButton.firstChild)

  // Modify event listener to handle file upload
  customButton.addEventListener('click', function () {
    inputFile.click()
  })

  listFileElement.classList.add('list-files')
  inputFile.addEventListener('change', function (event) {
    const selectedFiles = event.target.files

    for (let i = 0; i < selectedFiles.length; i++) {
      const listItem = document.createElement('div')
      listItem.classList.add('file')

      const fileInfoContainer = document.createElement('div')
      fileInfoContainer.classList.add('file-info-container')

      const fileName = document.createElement('span')
      fileName.classList.add('file-name')
      fileName.textContent = selectedFiles[i].name

      // Create a span for the file size
      const fileSize = document.createElement('span')
      fileSize.classList.add('file-size')
      fileSize.textContent = formatFileSize(selectedFiles[i].size)

      // Create a span for the upload percentage
      const percentageDisplay = document.createElement('span')
      percentageDisplay.classList.add('percentage-display')

      // Create a delete button
      const deleteButton = document.createElement('i')
      deleteButton.classList.add('bi', 'bi-x')
      deleteButton.style.cursor = 'pointer'

      // Add event listener to delete the corresponding file
      deleteButton.addEventListener('click', function () {
        listItem.remove()
        // You may want to perform additional actions, such as canceling the upload request, etc.
      })

      // Append spans and delete button to the list item
      listItem.appendChild(fileInfoContainer)
      listItem.appendChild(percentageDisplay)
      fileInfoContainer.appendChild(fileName)
      fileInfoContainer.appendChild(fileSize)
      listItem.appendChild(deleteButton)

      // Append the list item to the list container
      listFileElement.appendChild(listItem)

      // Perform file upload
      // uploadFile(selectedFiles[i], percentageDisplay)
    }
  })

  inputFile.parentNode.appendChild(listFileElement)
}

function uploadFile(file, percentageDisplay) {
  const xhr = new XMLHttpRequest()
  const formData = new FormData()

  formData.append('file', file)

  xhr.open('POST', 'your-upload-url', true)

  // Add a progress event listener
  xhr.upload.addEventListener('progress', function (event) {
    if (event.lengthComputable) {
      const percentage = Math.floor((event.loaded / event.total) * 100)
      percentageDisplay.textContent = percentage + '%'
    }
  })

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Handle the response after the file is uploaded
      console.log('Upload complete')
    }
  }

  // Send the file data
  xhr.send(formData)
}
