import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { useStoredDates } from './hooks/useStoredAnalyseDates';
import { getTwoMonthsAgo, truncateTime, useDayKey } from '../utils/dateFunctions';
import { LocationData } from '../services/locationService';

interface DatePickerFormProps {
    onSubmit: (dates: Date[]) => void;
    onInvalidateResults: () => void;
    isLoading: boolean;
    isDisabled: boolean;
    location: LocationData | undefined;
}

interface FormErrors {
    dates?: string;
}

const AnalyseForm = ({ onSubmit, onInvalidateResults, isLoading, isDisabled = false, location }: DatePickerFormProps) => {
    const [errors, setErrors] = useState<FormErrors>({});
    const dayKey = useDayKey();

    const minDate = useMemo(() => truncateTime(getTwoMonthsAgo()), [dayKey]);
    const maxDate = useMemo(() => truncateTime(new Date()), [dayKey]);

    const [selectedDates, setDates, invalidateResults] = useStoredDates(minDate, maxDate, onInvalidateResults);

    useEffect(() => {
        invalidateResults();
    }, [location]);

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

    return (
        <form onSubmit={handleSubmit} className="analyse-symptoms-form">
            <div className="date-picker-input-group">
                <label>Selecteer datums:</label>
                <Calendar
                    multiple
                    value={selectedDates}
                    onChange={setDates}
                    disabled={isLoading || isDisabled}
                    format="DD/MM/YYYY"
                    weekStartDayIndex={1}
                    minDate={minDate}
                    maxDate={maxDate}
                    plugins={[
                        <DatePanel position="right" className="custom-date-panel" />
                    ]}
                    className={`${isLoading || isDisabled ? 'disabled-datepicker' : ''}`}
                />
                {errors.dates && <span className="date-picker-error">{errors.dates}</span>}
            </div>

            <button
                type="submit"
                disabled={isLoading || isDisabled}
                className="date-picker-submit-button"
            >
                {isLoading ? 'Analyseren...' : 'Analyseren'}
            </button>
        </form>
    );
};

export default AnalyseForm;