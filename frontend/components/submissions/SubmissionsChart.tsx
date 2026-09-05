import { Submission } from '@/types/index';

interface SubmissionsChartProps {
    submissions: Submission[];
    days?: number;
}

function dayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function SubmissionsChart({ submissions, days = 14 }: SubmissionsChartProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buckets: { key: string; label: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        buckets.push({
            key: dayKey(date),
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: 0,
        });
    }

    const countsByDay = new Map(buckets.map(b => [b.key, b]));
    for (const submission of submissions) {
        const key = dayKey(new Date(submission.createdAt));
        const bucket = countsByDay.get(key);
        if (bucket) bucket.count += 1;
    }

    const max = Math.max(1, ...buckets.map(b => b.count));

    return (
        <div>
            <div className="flex items-end gap-1 h-24">
                {buckets.map((bucket) => (
                    <div key={bucket.key} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        <div
                            className="w-full bg-primary/70 hover:bg-primary rounded-t transition-colors"
                            style={{ height: `${(bucket.count / max) * 100}%`, minHeight: bucket.count > 0 ? '2px' : '0' }}
                        />
                        <div className="absolute -top-6 hidden group-hover:block text-xs bg-text text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                            {bucket.count} on {bucket.label}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-text-muted">
                <span>{buckets[0].label}</span>
                <span>{buckets[buckets.length - 1].label}</span>
            </div>
        </div>
    );
}
