const fileInput = document.getElementById('photo')

// This is for storing the base64 strings
let myFiles = {}
// if you expect files by default, make this disabled
// we will wait until the last file being processed
let isFilesReady = true

fileInput.addEventListener('change', async (event) => {
  // clean up earliest items
  myFiles = {}
  // set state of files to false until each of them is processed
  isFilesReady = false
  // this is to get the input name attribute, in our case it will yield as "picture"
  // I'm doing this because I want you to use this code dynamically
  // so if you change the input name, the result also going to effect
  const inputKey = 'photo'
  var files = event.target.files;

  const filePromises = Object.entries(files).map(item => {
    return new Promise((resolve, reject) => {
      const [index, file] = item
      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = function(event) {
        // if it's multiple upload field then set the object key as picture[0], picture[1]
        // otherwise just use picture
        const fileKey = `${inputKey}${files.length > 1 ? `[${index}]` : ''}`
        // Convert Base64 to data URI
        // Assign it to your object
        myFiles[fileKey] = `${btoa(event.target.result)}`

        resolve()
      };
      reader.onerror = function() {
        console.log("can't read the file");
        reject()
      };
    })
  })

  Promise.all(filePromises)
    .then(() => {
      console.log('ready to submit')
      isFilesReady = true
    })
    .catch((error) => {
      console.log(error)
      console.log('something wrong happened')
    })
})
const formElement = document.getElementById('form')

const handleForm = async (event) => {
  event.preventDefault();

  if(!isFilesReady){
    console.log('files still getting processed')
    return
  }
 
  const formData = new FormData(formElement)

	// get name and message input from our <form> element
  let data = {
    'email': formData.get('email'),
    'fname': formData.get('fname'),
    'lname': formData.get('lname'),
    'mname': formData.get('mname'),
    'org': formData.get('org'),
    'w_phone': formData.get('w_phone'),
    'title': formData.get('title'),
    'url': formData.get('url'),
    'workurl': formData.get('workurl'),
    'note': formData.get('note'),
    'nickname': formData.get('nickname'),
    'prefix': formData.get('prefix'),
    'suffix': formData.get('suffix'),
    'gender': formData.get('gender'),
    'role': formData.get('role'),
    'h_phone': formData.get('h_phone'),
    'c_phone': formData.get('c_phone'),
    'p_phone': formData.get('p_phone'),
    'h_fax': formData.get('h_fax'),
    'w_fax': formData.get('w_fax'),
    'h_email': formData.get('h_email'),
    'w_email': formData.get('w_email'),
    'alias': formData.get('alias'),
    'h_address': formData.get('h_address'),
    'w_address': formData.get('w_address'),
  }

	// iterate over the base64 files we've converted
  Object.entries(myFiles).map(item => {
	// destruct the file
    const [key, file] = item
	// append it to our data object
    data[key] = file
  })

  fetch('http://localhost:5000/cards', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
}

formElement.addEventListener('submit', handleForm)
