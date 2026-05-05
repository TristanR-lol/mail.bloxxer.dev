document.addEventListener('DOMContentLoaded', () => {
  const sessionToken = localStorage.getItem('sessionToken')
  
  if (sessionToken) {
    document.getElementById('Email').style.display = 'flex'
    document.getElementById('LoginPopup').style.display = 'none'
  } else {
    document.getElementById('Email').style.display = 'none'
    document.getElementById('LoginPopup').style.display = 'flex'
  }
})

document.getElementById('LoginButton').addEventListener('click', async () => {
  const email = document.getElementById('EmailHeader').value
  const password = document.getElementById('PasswordHeader').value

  if (!email || !password) {
    alert('Please fill in all fields!')
    return
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const result = await response.json()

    if (result.session && result.error == null) {
      localStorage.setItem('sessionToken', result.session.access_token)
      localStorage.setItem('userEmail', result.user.email)
      localStorage.setItem('userId', result.user.id)

      const userProfile = await fetch('/api/get-user-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: result.user.id })
      }).then(r => r.json())

      localStorage.setItem('fromEmail', userProfile.newemail)

      document.getElementById('LoginPopup').style.display = 'none'
      document.getElementById('Email').style.display = 'flex'
    } else {
      alert('Login failed: ' + (result.error || 'Unknown error'))
    }
  } catch (error) {
    alert('Error: ' + error.message)
  }
})

document.getElementById('SendButton').addEventListener('click', async () => {
  const to = document.getElementById('ToHeader').value
  const subject = document.getElementById('SubjectHeader').value
  const message = document.getElementById('MessageBody').value
  const fromEmail = localStorage.getItem('fromEmail')

  if (!to || !subject || !message) {
    alert('Please fill in all fields!')
    return
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, message, fromEmail })
    })

    const result = await response.json()

    if (result.success) {
      alert('Email sent! ✓')
      document.getElementById('ToHeader').value = ''
      document.getElementById('SubjectHeader').value = ''
      document.getElementById('MessageBody').value = ''
    } else {
      alert('Error: ' + result.error)
    }
  } catch (error) {
    alert('Error sending email: ' + error.message)
  }
})