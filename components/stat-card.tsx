interface StatCardProps {
    value: string
    description: string
  }

  export function StatCard({ value, description }: StatCardProps) {
    return (
      <div className="text-center">
        <p className="w-[75%] mx-auto text-left text-sm text-[#4A5568]">{description}</p>
        <h3 className="text-4xl pl-16 text-left font-bold text-[#0A2342] mb-2 pt-3">{value}</h3>
      </div>
    )
  }

