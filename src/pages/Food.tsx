import { Page, Card } from '../ui'

export default function Food() {
  return (
    <Page title="אוכל">
      <Card>
        <p className="text-[17px]">כאן יהיה תפריט השבוע וימי הבישול.</p>
        <p className="text-[15px] text-secondary mt-1">בקרוב 🚧</p>
      </Card>
    </Page>
  )
}
