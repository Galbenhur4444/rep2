import { Page, Card } from '../ui'

export default function Food() {
  return (
    <Page title="אוכל">
      <Card>
        <p className="text-[19px]">כאן יהיה תפריט השבוע וימי הבישול.</p>
        <p className="text-[17px] text-secondary mt-1">בקרוב 🚧</p>
      </Card>
    </Page>
  )
}
