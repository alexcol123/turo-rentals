import { fetchReservationStats } from "@/utils/actions"
import StatsCard from "../admin/StatsCard"
import { formatCurrency } from "@/utils/format"

const Stats = async () => {

  const stats = await fetchReservationStats()

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="Properties" value={stats.properties} />
      <StatsCard title="Nights" value={stats.nights} />
      <StatsCard title="Amount" value={formatCurrency(stats.amount)} />
    </div>
  )
}
export default Stats