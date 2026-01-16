import { Users, CheckCircle, XCircle, TrendingUp, Clock } from "lucide-react";

const StatsCards = ({ stats }) => {
    if (!stats) {
        return (
            <div className="py-8 text-center text-sm text-[var(--color-muted)]">
                Loading statistics…
            </div>
        );
    }

    // Switch to Mint-Blue theme
    // document.documentElement.setAttribute("data-theme", "mint-blue");


    const cards = [
        { title: "Total Teams", value: stats.totalTeams || 0, icon: Users },
        { title: "Coupons Used", value: stats.usedCoupons || 0, icon: CheckCircle },
        { title: "Coupons Unused", value: stats.unusedCoupons || 0, icon: XCircle },
        { title: "Redemption Rate", value: `${stats.percentageRedeemed || 0}%`, icon: TrendingUp },
    ];

    // Common styles
    const cardBaseStyle = `
    rounded-xl
    p-3 sm:p-4 md:p-5
    border
    transition-all duration-200
    hover:-translate-y-0.5 hover:shadow-md
  `;

    const cardIconStyle = `
    flex items-center justify-center
    rounded-full p-3
    bg-white/40
    h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16
  `;

    const cardTitleStyle = `
    text-[0.6rem] sm:text-xs uppercase tracking-wide
    text-[var(--color-text-secondary)]
  `;

    const cardValueStyle = `
    text-lg sm:text-2xl md:text-3xl font-bold
    text-[var(--color-text-primary)]
  `;

    const lastScanStyle = `
    col-span-2 lg:col-span-4
    rounded-xl p-4 border
    bg-[var(--color-bg)]
    border-[var(--color-border)]
  `;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className={cardBaseStyle} style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Icon */}
                            <div className={cardIconStyle}>
                                <Icon style={{ color: "var(--color-accent)" }} className="h-full w-full" />
                            </div>

                            {/* Text */}
                            <div>
                                <p className={cardTitleStyle}>{card.title}</p>
                                <p className={cardValueStyle}>{card.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Last Scan Card */}
            {stats.lastScanTime && (
                <div className={lastScanStyle}>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border">
                            <Clock className="h-4 w-4 text-[var(--color-muted)]" />
                        </div>
                        <div>
                            <p className={cardTitleStyle}>Last Scan</p>
                            <p className="text-sm sm:text-base font-medium text-[var(--color-text)]">
                                {new Date(stats.lastScanTime).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsCards;
