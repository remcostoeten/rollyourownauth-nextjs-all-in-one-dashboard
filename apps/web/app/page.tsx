import { Button } from 'ui'

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Page for UI Components</h1>
      
      <div className="space-x-4">
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="link">Link Button</Button>
      </div>

      <div className="space-x-4">
        <Button size="sm">Small Button</Button>
        <Button size="default">Default Size</Button>
        <Button size="lg">Large Button</Button>
        <Button size="icon">🔍</Button>
      </div>
    </div>
  )
}
