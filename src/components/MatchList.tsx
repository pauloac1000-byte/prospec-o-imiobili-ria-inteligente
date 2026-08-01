export interface MatchItem {
  id: string
  title: string
  subtitle: string
  badge?: string
  badgeClass?: string
}

export function MatchList({
  items,
  onSelect,
  emptyMessage,
}: {
  items: MatchItem[]
  onSelect: (id: string) => void
  emptyMessage: string
}) {
  if (items.length === 0) {
    return <p className="text-xs text-slate-500 text-center py-6">{emptyMessage}</p>
  }
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition-colors text-left"
        >
          <div>
            <p className="text-sm font-medium text-slate-200">{item.title}</p>
            <p className="text-xs text-slate-400">{item.subtitle}</p>
          </div>
          {item.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.badgeClass || 'bg-slate-800 text-slate-300'}`}
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
