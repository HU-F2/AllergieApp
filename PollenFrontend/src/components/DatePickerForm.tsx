import { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

interface DatePickerFormProps {
    onSubmit: (dates: Date[]) => void;
    isLoading: boolean;
}

interface FormErrors {
    dates?: string;
}

const DatePickerForm = ({ onSubmit, isLoading }: DatePickerFormProps) => {
    const [dates, setDates] = useState<DateObject[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (dates.length < 3) newErrors.dates = 'Selecteer minimaal 3 datums';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(dates.map(dateObj => dateObj.toDate()));
    };

    return (
        <form onSubmit={handleSubmit} className="date-picker-form">
            <div className="date-picker-input-group">
                <label>Selecteer datums:</label>
                <DatePicker
                    multiple
                    value={dates}
                    onChange={setDates}
                    disabled={isLoading}
                    format="DD/MM/YYYY"
                />
                {errors.dates && <span className="date-picker-error">{errors.dates}</span>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="date-picker-submit-button"
            >
                {isLoading ? 'Analyseren...' : 'Analyseren'}
            </button>
        </form>
    );
};

export default DatePickerForm;