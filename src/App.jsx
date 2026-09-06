import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import theme from './theme'
import Button from './components/Button'

import Card from './components/Card'
import Input from './components/Input'
function App() {

  return (
    <>
    <Button variant="primary" onClick={() => alert('clicked')}>Create Account</Button>
<Button variant="secondary">Log In</Button>
<Button variant="danger">Reject</Button>
<Input label="Full Name" placeholder="Full Name" required />
<Input label="Password" type="password" placeholder="Password" />
<Input label="Confirm Password" type="password" error="Passwords do not match" />
<Card title="Registry Statistics">
  <p style={{ color: theme.colors.textSecondary }}>Total Entities: 1250</p>
  <p style={{ color: theme.colors.textSecondary }}>Flagged Entities: 15</p>
</Card>

<Card padding="16px">
  <Button variant="primary">Inside a plain card, no title</Button>
</Card>
     </>
  )
}

export default App
