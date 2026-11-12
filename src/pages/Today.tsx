import { Page, Card } from '../ui'

export default function Today() {
  return (
    <Page title="היום">
      <Card>
        <p className="text-[17px]">האימון הבא והארוחות של היום יופיעו כאן.</p>
        <p className="text-[15px] text-secondary mt-1">בקרוב 🚧</p>
      </Card>
    </Page>
  )
}
