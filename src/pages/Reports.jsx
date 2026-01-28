import { useState, useEffect } from 'react'
import { reportsAPI } from '../services/api'
import PageContainer from '../layouts/PageContainer'
import { Download, Calendar, FileText, TrendingUp, Clock, Car, Utensils } from 'lucide-react'



function Reports() {
    const [activeReport, setActiveReport] = useState('weekly')
    const [downloading, setDownloading] = useState(false)
    const [reportData, setReportData] = useState({
        totalHours: "0h 0m",
        overtime: "0h 0m",
        totalTravelKm: 0,  // Changed from travelExpense to totalTravelKm
        foodExpense: 0,
        entries: []
    })

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Determine API call based on activeReport
                const response = await (activeReport === 'weekly' ? reportsAPI.getWeekly() : reportsAPI.getMonthly())
                setReportData(response.data)
            } catch (error) {
                console.error('Failed to fetch report:', error)
            }
        }
        fetchReport()
    }, [activeReport])

    const handleDownload = async () => {
        setDownloading(true)
        try {
            const response = await reportsAPI.downloadPDF(activeReport)

            // Create blob and download link
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${activeReport}_report.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Download failed:', error)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <PageContainer withAnimatedBg>
            <div className="page-header">
                <h1 className="page-title">
                    <FileText size={24} />
                    Reports
                </h1>
                <div className="avatar">U</div>
            </div>

            {/* Report Type Tabs */}
            <div className="tabs mb-6">
                <div
                    className={`tab ${activeReport === 'weekly' ? 'active' : ''}`}
                    onClick={() => setActiveReport('weekly')}
                >
                    Weekly
                </div>
                <div
                    className={`tab ${activeReport === 'monthly' ? 'active' : ''}`}
                    onClick={() => setActiveReport('monthly')}
                >
                    Monthly
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="mb-6 stagger-children">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <Clock size={18} />
                    </div>
                    <div className="text-2xl font-bold">{reportData.totalHours}</div>
                    <div className="text-sm text-muted">Total Hours</div>
                </div>

                <div className="glass-card glass-card-highlight p-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <TrendingUp size={18} />
                    </div>
                    <div className="text-2xl font-bold text-gradient">{reportData.overtime}</div>
                    <div className="text-sm text-muted">Overtime</div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <Car size={18} />
                    </div>
                    <div className="text-2xl font-bold">{reportData.totalTravelKm} km</div>
                    <div className="text-sm text-muted">Travel</div>
                </div>

                <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <Utensils size={18} />
                    </div>
                    <div className="text-2xl font-bold">₹{reportData.foodExpense}</div>
                    <div className="text-sm text-muted">Food</div>
                </div>
            </div>

            {/* Daily Breakdown */}
            <div className="glass-card p-4 mb-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-accent" />
                    Daily Breakdown
                </h3>

                <div className="space-y-3">
                    {reportData.entries.map((entry, index) => (
                        <div
                            key={entry.day}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            <div>
                                <div className="font-medium">{entry.day}</div>
                                <div className="text-sm text-muted">
                                    {entry.hours} worked {entry.overtime !== 0 && `(+${entry.overtime} OT)`}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm">
                                    {entry.travel_km > 0 && <span className="text-muted">{entry.travel_km}km</span>}
                                    {entry.food > 0 && <span className="text-accent ml-2">₹{entry.food}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="btn btn-primary btn-lg w-full"
                disabled={downloading}
            >
                {downloading ? (
                    'Generating PDF...'
                ) : (
                    <>
                        <Download size={20} />
                        Download {activeReport === 'weekly' ? 'Weekly' : 'Monthly'} Report
                    </>
                )}
            </button>
        </PageContainer>
    )
}

export default Reports
