import { useState } from 'react';
import { Calendar, DateObject } from 'react-multi-date-picker';
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { getTwoMonthsAgo } from '../utils/utilityFunctions';

interface DatePickerFormProps {
    onSubmit: (dates: Date[]) => void;
    isLoading: boolean;
}

interface FormErrors {
    dates?: string;
}

const DatePickerForm = ({ onSubmit, isLoading }: DatePickerFormProps) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (selectedDates.length < 3) newErrors.dates = 'Selecteer minimaal 3 datums';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(selectedDates);
    };

    function setDates(dates: DateObject[]): false | void {
        const sortedDates : Date[] = dates
            .map(dateObj => dateObj.toDate() as Date)
            .sort((a, b) => a.getTime() - b.getTime());

        setSelectedDates(sortedDates);
    }

    return (
        <form onSubmit={handleSubmit} className="analyse-symptoms-form">
            <div className="date-picker-input-group">
                <label>Selecteer datums:</label>
                <Calendar
                    multiple
                    value={selectedDates}
                    onChange={setDates}
                    disabled={isLoading}
                    format="DD/MM/YYYY"
                    weekStartDayIndex={1}
                    minDate={getTwoMonthsAgo()}
                    maxDate={new Date()}
                    plugins={[
                        <DatePanel position="right" className="custom-date-panel" />
                    ]}
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