import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entriesAPI } from '../services/api'
import PageContainer from '../layouts/PageContainer'
import Calendar from '../components/Calendar'
import CategoryPill from '../components/CategoryPill'
import { ArrowLeft, Clock, Car, Utensils, FileText, Check } from 'lucide-react'

const VEHICLE_TYPES = ['Bike', 'Cab', 'Car', 'Bus']
const CATEGORIES = ['Regular Day', 'Holiday']

function AddEntry() {
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [formData, setFormData] = useState({
        in_time: '',
        out_time: '',
        is_holiday: false,
        vehicle_type: 'Bike',
        kilometers: '',
        fooding_amount: '',
        description: ''
    })
    const [selectedCategory, setSelectedCategory] = useState('Regular Day')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Check if selected date is Sunday
    const isSunday = selectedDate.getDay() === 0

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Format data for API
        // If Sunday or Holiday category, mark as holiday
        // Use local date formatting to avoid timezone offset issues
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        const localDateStr = `${year}-${month}-${day}`

        const entryData = {
            date: localDateStr,
            in_time: formData.in_time,
            out_time: formData.out_time,
            is_holiday: selectedCategory === 'Holiday' || isSunday,
            vehicle_type: formData.vehicle_type.toLowerCase(),
            kilometers: formData.kilometers || 0,
            fooding_amount: formData.fooding_amount || 0,
            description: formData.description.trim()
        }

        try {
            const response = await entriesAPI.addEntry(entryData)
            if (response.data.success) {
                setSuccess(true)
                setTimeout(() => navigate('/dashboard'), 1500)
            }
        } catch (error) {
            console.error('Failed to add entry:', error)
            // Handle error (alert or state) - keeping simple for now
            alert('Error adding entry: ' + (error.response?.data?.message || 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <PageContainer withAnimatedBg>
                <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                    <div className="btn btn-primary btn-icon mb-4" style={{ width: 80, height: 80 }}>
                        <Check size={40} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Entry Created!</h2>
                    <p className="text-muted">Your entry has been saved successfully.</p>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer withAnimatedBg>
            {/* Header */}
            <div className="page-header">
                <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title">Create Entry</h1>
                <div style={{ width: 40 }} />
            </div>

            <form onSubmit={handleSubmit}>
                {/* Calendar */}
                <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />

                {/* Sunday Notice */}
                {isSunday && (
                    <div className="glass-card p-4 mt-4 mb-4" style={{ borderColor: 'var(--accent)', borderWidth: '1px' }}>
                        <div className="text-accent font-medium mb-1">📅 Sunday Detected</div>
                        <div className="text-sm text-muted">
                            All working hours on Sunday will be counted as overtime automatically.
                        </div>
                    </div>
                )}

                {/* Category Selection */}
                <div className="mt-4 mb-4">
                    <label className="form-label mb-2 block">Category</label>
                    <div className="category-pills">
                        {CATEGORIES.map(cat => (
                            <CategoryPill
                                key={cat}
                                label={cat}
                                active={selectedCategory === cat || (isSunday && cat === 'Holiday')}
                                onClick={() => setSelectedCategory(cat)}
                            />
                        ))}
                    </div>
                    {selectedCategory === 'Holiday' && (
                        <p className="text-sm text-muted mt-2">
                            All working hours on holidays count as overtime.
                        </p>
                    )}
                </div>

                {/* Time Inputs */}
                <div className="glass-card p-4 mb-4">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                        <Clock size={20} />
                        <h4 className="font-medium">Work Hours</h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">In Time</label>
                            <input
                                type="time"
                                name="in_time"
                                value={formData.in_time}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Out Time</label>
                            <input
                                type="time"
                                name="out_time"
                                value={formData.out_time}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Travel Expense */}
                <div className="glass-card p-4 mb-4">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                        <Car size={20} />
                        <h4 className="font-medium">Travel Expense</h4>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label mb-2 block">Vehicle Type</label>
                        <div className="category-pills">
                            {VEHICLE_TYPES.map(type => (
                                <CategoryPill
                                    key={type}
                                    label={type}
                                    active={formData.vehicle_type === type}
                                    onClick={() => setFormData(prev => ({ ...prev, vehicle_type: type }))}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Distance (km)</label>
                        <input
                            type="number"
                            name="kilometers"
                            value={formData.kilometers}
                            onChange={handleChange}
                            placeholder="0"
                            className="form-input"
                            step="0.1"
                        />
                    </div>
                </div>

                {/* Food Expense */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                        <Utensils size={20} />
                        <h4 className="font-medium">Food Expense</h4>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <input
                            type="number"
                            name="fooding_amount"
                            value={formData.fooding_amount}
                            onChange={handleChange}
                            placeholder="0"
                            className="form-input"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-accent">
                        <FileText size={20} />
                        <h4 className="font-medium">Description (Optional)</h4>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add notes about your work today..."
                            className="form-input"
                            rows={3}
                            maxLength={500}
                            style={{ resize: 'none' }}
                        />
                        <div className="text-xs text-muted mt-1 text-right">
                            {formData.description.length}/500
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary btn-lg w-full"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : (
                        <>
                            <Check size={20} />
                            Create Entry
                        </>
                    )}
                </button>
            </form>
        </PageContainer>
    )
}

export default AddEntry
