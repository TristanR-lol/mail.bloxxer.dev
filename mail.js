document.getElementById('SendButton').addEventListener('click', async () => {
  const to = document.getElementById('ToHeader').value;
  const subject = document.getElementById('SubjectHeader').value;
  const message = document.getElementById('MessageBody').value;

  if (!to || !subject || !message) {
    alert('Please fill in all fields!');
    return;
  }

  try {
    const response = await fetch('/api/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, message })
    });

    const result = await response.json();
    
    if (result.success) {
      alert('Email sent! ✓');
      // Clear the form
      document.getElementById('ToHeader').value = '';
      document.getElementById('SubjectHeader').value = '';
      document.querySelector('.MessageBody').innerHTML = '';
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Error sending email: ' + error.message);
  }
});