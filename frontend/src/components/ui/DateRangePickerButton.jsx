'use client';

import React, {
  useEffect, useState, useRef, useId,
} from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DATE_FILTER_PRESETS = [
  'Till Date',
  'This Month',
  'Last Month',
  'This Week',
  'Last 30 Days',
];

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MIN_DASHBOARD_DATE = `${new Date().getFullYear()}-01-01`;

export const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateValue = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getTodayValue = () => toDateInputValue(new Date());

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const getPresetRange = (preset) => {
  const today = parseDateValue(getTodayValue());

  if (preset === 'This Month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      from: toDateInputValue(startOfMonth),
      to: toDateInputValue(endOfMonth),
    };
  }

  if (preset === 'Last Month') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);

    return {
      from: toDateInputValue(start),
      to: toDateInputValue(end),
    };
  }

  if (preset === 'This Week') {
    const dayOfWeek = today.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
    const startOfWeek = addDays(today, distanceToMonday);
    const endOfWeek = addDays(startOfWeek, 6);
    return {
      from: toDateInputValue(startOfWeek),
      to: toDateInputValue(endOfWeek),
    };
  }

  if (preset === 'Last 30 Days') {
    return {
      from: toDateInputValue(addDays(today, -29)),
      to: toDateInputValue(today),
    };
  }

  return {
    from: MIN_DASHBOARD_DATE,
    to: toDateInputValue(today),
  };
};

export const getInitialDateRange = () => getPresetRange('Till Date');

export const getDateRangeLabel = (range) => {
    if (!range || !range.from || !range.to) return 'Select Date Range';
    const tillDateRange = getPresetRange('Till Date');
    const last30DaysRange = getPresetRange('Last 30 Days');
    const thisMonthRange = getPresetRange('This Month');
    const lastMonthRange = getPresetRange('Last Month');
    const thisWeekRange = getPresetRange('This Week');
 
    if (range.from === tillDateRange.from && range.to === tillDateRange.to) return 'Till Date';
    if (range.from === last30DaysRange.from && range.to === last30DaysRange.to) return 'Last 30 Days';
    if (range.from === thisMonthRange.from && range.to === thisMonthRange.to) return 'This Month';
    if (range.from === lastMonthRange.from && range.to === lastMonthRange.to) return 'Last Month';
    if (range.from === thisWeekRange.from && range.to === thisWeekRange.to) return 'This Week';
 
    const from = parseDateValue(range.from);
    const to = parseDateValue(range.to);
    
    // Safety check for NaN in case of malformed dates
    if (isNaN(from) || isNaN(to)) return 'Select Date Range';

    return `${MONTH_LABELS[from.getMonth()]} ${from.getDate()}, ${from.getFullYear()} - ${MONTH_LABELS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
};

export const isInitialDateRange = (range) => {
  if (!range) return false;
  const initialRange = getInitialDateRange();
  return range.from === initialRange.from && range.to === initialRange.to;
};

const buildCalendarDays = (monthDate, range) => {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = addDays(firstOfMonth, -firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const value = toDateInputValue(date);
    const isMuted = date.getMonth() !== monthDate.getMonth();

    return {
      value,
      day: date.getDate(),
      isMuted,
      isStart: !isMuted && value === range.from,
      isEnd: !isMuted && value === range.to,
      isInRange: !isMuted && value > range.from && value < range.to,
    };
  });
};

const getDatePickerDayClass = (day) => {
  if (day.isStart || day.isEnd) return 'bg-primary font-semibold text-white shadow-sm';
  if (day.isInRange) return 'bg-primary/10 text-primary';
  if (day.isMuted) return 'text-cloud hover:bg-primary/5';
  return 'text-charcoal hover:bg-primary/5 hover:text-primary';
};

function CalendarMonth({
  monthDate, range, onDateSelect, onMonthChange, onMonthSelect, onYearSelect,
}) {
  const monthDays = buildCalendarDays(monthDate, range);

  return (
    <div className="w-[248px] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(-1)}
          className="grid h-7 w-7 place-items-center rounded-full text-warm-gray transition-colors hover:bg-primary/5 hover:text-primary"
          title="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          <select
            value={monthDate.getMonth()}
            onChange={(e) => onMonthSelect(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold text-charcoal cursor-pointer hover:text-primary outline-none border-b border-dashed border-gray-400/80 hover:border-primary py-0.5 px-1 rounded-sm hover:bg-gray-100/50 transition-all appearance-none text-center"
            style={{ backgroundImage: 'none' }}
          >
            {MONTH_LABELS.map((label, idx) => (
              <option key={label} value={idx}>{label}</option>
            ))}
          </select>
          <select
            value={monthDate.getFullYear()}
            onChange={(e) => onYearSelect(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold text-charcoal cursor-pointer hover:text-primary outline-none border-b border-dashed border-gray-400/80 hover:border-primary py-0.5 px-1 rounded-sm hover:bg-gray-100/50 transition-all appearance-none text-center"
            style={{ backgroundImage: 'none' }}
          >
            {Array.from({ length: 15 }, (_, idx) => {
              const year = new Date().getFullYear() - 10 + idx;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
        <button
          type="button"
          onClick={() => onMonthChange(1)}
          className="grid h-7 w-7 place-items-center rounded-full text-warm-gray transition-colors hover:bg-primary/5 hover:text-primary"
          title="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((weekday) => (
          <span key={weekday} className="text-[11px] font-medium text-warm-gray">{weekday}</span>
        ))}
        {monthDays.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => onDateSelect(day.value)}
            className={`mx-auto grid h-7 w-8 place-items-center rounded-md text-xs transition-colors ${getDatePickerDayClass(day)}`}
          >
            {day.day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DateRangePickerButton({
  dateRange, onApply, label, compact = false, align = 'right', className = '', popoverWidth,
}) {
  const pickerId = useId();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftRange, setDraftRange] = useState(dateRange);
  const [preset, setPreset] = useState(getDateRangeLabel(dateRange));
  const [activeBoundary, setActiveBoundary] = useState('from');

  const getSafeDate = (dateStr) => {
    return dateStr ? parseDateValue(dateStr) : new Date();
  };

  const [leftVisibleMonth, setLeftVisibleMonth] = useState(getSafeDate(dateRange.from));
  const [rightVisibleMonth, setRightVisibleMonth] = useState(() => {
    const fromDate = getSafeDate(dateRange.from);
    const toDate = getSafeDate(dateRange.to);
    if (fromDate.getFullYear() === toDate.getFullYear() && fromDate.getMonth() === toDate.getMonth()) {
      return new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1);
    }
    return toDate;
  });

  const handleLeftVisibleMonthChange = (newMonth) => {
    setLeftVisibleMonth(newMonth);
    if (newMonth.getFullYear() === rightVisibleMonth.getFullYear() && newMonth.getMonth() === rightVisibleMonth.getMonth()) {
      setRightVisibleMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 1));
    } else if (newMonth >= rightVisibleMonth) {
      setRightVisibleMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 1));
    }
  };

  const handleRightVisibleMonthChange = (newMonth) => {
    setRightVisibleMonth(newMonth);
    if (newMonth.getFullYear() === leftVisibleMonth.getFullYear() && newMonth.getMonth() === leftVisibleMonth.getMonth()) {
      setLeftVisibleMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() - 1, 1));
    } else if (newMonth <= leftVisibleMonth) {
      setLeftVisibleMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() - 1, 1));
    }
  };

  useEffect(() => {
    if (isOpen) {
      setDraftRange(dateRange);
      setPreset(getDateRangeLabel(dateRange));
      const fromDate = getSafeDate(dateRange.from);
      const toDate = getSafeDate(dateRange.to);
      setLeftVisibleMonth(fromDate);
      if (fromDate.getFullYear() === toDate.getFullYear() && fromDate.getMonth() === toDate.getMonth()) {
        setRightVisibleMonth(new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1));
      } else {
        setRightVisibleMonth(toDate);
      }
    }
  }, [dateRange, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const buttonLabel = label || getDateRangeLabel(dateRange);

  const handlePresetChange = (event) => {
    const nextPreset = event.target.value;
    setPreset(nextPreset);
    if (nextPreset === 'Custom') return;

    const nextRange = getPresetRange(nextPreset);
    setDraftRange(nextRange);
    const fromDate = parseDateValue(nextRange.from);
    const toDate = parseDateValue(nextRange.to);
    setLeftVisibleMonth(fromDate);
    if (fromDate.getFullYear() === toDate.getFullYear() && fromDate.getMonth() === toDate.getMonth()) {
      setRightVisibleMonth(new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1));
    } else {
      setRightVisibleMonth(toDate);
    }
  };

  const handleFromInputChange = (val) => {
    setDraftRange((prev) => {
      if (val > prev.to) {
        return { from: val, to: val };
      }
      return { ...prev, from: val };
    });
    setPreset('Custom');
  };

  const handleToInputChange = (val) => {
    setDraftRange((prev) => {
      if (val < prev.from) {
        return { from: val, to: val };
      }
      return { ...prev, to: val };
    });
    setPreset('Custom');
  };

  const handleCompactDateSelect = (value) => {
    if (activeBoundary === 'from') {
      setDraftRange({ from: value, to: value });
      setActiveBoundary('to');
    } else if (value < draftRange.from) {
      setDraftRange({ from: value, to: value });
      setActiveBoundary('to');
    } else {
      setDraftRange({ from: draftRange.from, to: value });
      setActiveBoundary('from');
    }
    setPreset('Custom');
  };

  const handleLeftDateSelect = (value) => {
    if (compact) {
      handleCompactDateSelect(value);
      return;
    }
    setDraftRange((prev) => {
      if (value > prev.to) {
        return { from: value, to: value };
      }
      return { ...prev, from: value };
    });
    setActiveBoundary('to');
    setPreset('Custom');
  };

  const handleRightDateSelect = (value) => {
    if (compact) {
      handleCompactDateSelect(value);
      return;
    }
    setDraftRange((prev) => {
      if (value < prev.from) {
        return { from: value, to: value };
      }
      return { ...prev, to: value };
    });
    setActiveBoundary('from');
    setPreset('Custom');
  };

  const handleCancel = () => {
    setDraftRange(dateRange);
    setPreset(getDateRangeLabel(dateRange));
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply(draftRange);
    setIsOpen(false);
  };

  let alignClasses = 'max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto sm:right-0 sm:left-auto sm:translate-x-0';
  if (align === 'left') {
    alignClasses = 'max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto sm:right-auto sm:left-0 sm:translate-x-0';
  } else if (align === 'responsive') {
    alignClasses = 'max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto sm:right-auto sm:left-0 sm:translate-x-0 lg:right-0 lg:left-auto lg:translate-x-0';
  } else if (align === 'center') {
    alignClasses = 'max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto sm:right-0 sm:left-auto sm:translate-x-0 xl:left-1/2 xl:-translate-x-1/2 xl:right-auto';
  }

  const popoverClassName = compact
    ? 'absolute z-[100] mt-3 w-[300px] max-w-[calc(100vw-2rem)] rounded-lg border border-primary bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)] left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
    : `absolute z-[100] mt-3 ${popoverWidth || 'w-[min(92vw,760px)] sm:max-w-[calc(100vw-340px)] xl:max-w-none'} max-h-[90vh] overflow-y-auto rounded-lg border border-primary bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${alignClasses}`;

  return (
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title={buttonLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-lg border border-cloud bg-white font-medium text-charcoal shadow-sm transition-colors hover:border-primary hover:text-primary ${compact ? 'h-10 px-3 text-xs' : 'h-10 px-4 text-sm'
        } ${className || (!compact ? 'min-w-[150px]' : '')}`}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarDays size={compact ? 17 : 19} className="shrink-0 text-warm-gray" />
          <span className="truncate">{buttonLabel}</span>
        </span>
        <ChevronDown
          size={compact ? 13 : 15}
          className="shrink-0 text-warm-gray transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {isOpen && (
        <>
          <div
            role="dialog"
            aria-label="Select date range"
            className={popoverClassName}
          >
            <div className={compact ? 'grid gap-4' : 'grid gap-5 lg:grid-cols-[1fr_160px]'}>
              <div className={compact ? 'flex justify-center overflow-hidden' : 'flex gap-3 overflow-x-auto'}>
                <CalendarMonth
                  monthDate={leftVisibleMonth}
                  range={draftRange}
                  onDateSelect={handleLeftDateSelect}
                  onMonthChange={(direction) => handleLeftVisibleMonthChange(
                    new Date(leftVisibleMonth.getFullYear(), leftVisibleMonth.getMonth() + direction, 1),
                  )}
                  onMonthSelect={(m) => handleLeftVisibleMonthChange(
                    new Date(leftVisibleMonth.getFullYear(), m, 1),
                  )}
                  onYearSelect={(y) => handleLeftVisibleMonthChange(
                    new Date(y, leftVisibleMonth.getMonth(), 1),
                  )}
                />
                {!compact && (
                  <CalendarMonth
                    monthDate={rightVisibleMonth}
                    range={draftRange}
                    onDateSelect={handleRightDateSelect}
                    onMonthChange={(direction) => handleRightVisibleMonthChange(
                      new Date(rightVisibleMonth.getFullYear(), rightVisibleMonth.getMonth() + direction, 1),
                    )}
                    onMonthSelect={(m) => handleRightVisibleMonthChange(
                      new Date(rightVisibleMonth.getFullYear(), m, 1),
                    )}
                    onYearSelect={(y) => handleRightVisibleMonthChange(
                      new Date(y, rightVisibleMonth.getMonth(), 1),
                    )}
                  />
                )}
              </div>

              <div>
                <label htmlFor={`${pickerId}-preset`} className="mb-2 block text-xs font-semibold text-charcoal">
                  Select Date Range
                </label>
                <select
                  id={`${pickerId}-preset`}
                  value={DATE_FILTER_PRESETS.includes(preset) ? preset : 'Custom'}
                  onChange={handlePresetChange}
                  className="mb-4 h-10 w-full rounded-lg border border-cloud bg-white px-3 text-xs text-charcoal outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {DATE_FILTER_PRESETS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <label htmlFor={`${pickerId}-from`} className="text-xs font-semibold text-charcoal">
                    From
                    <input
                      id={`${pickerId}-from`}
                      type="date"
                      value={draftRange.from}
                      onFocus={() => setActiveBoundary('from')}
                      onChange={(event) => handleFromInputChange(event.target.value)}
                      className={`mt-2 h-10 w-full rounded-lg border px-2 text-xs font-normal text-charcoal outline-none transition-all ${activeBoundary === 'from'
                        ? 'border-primary ring-2 ring-primary/15 shadow-sm'
                        : 'border-cloud hover:border-gray-300'
                      }`}
                    />
                  </label>
                  <label htmlFor={`${pickerId}-to`} className="text-xs font-semibold text-charcoal">
                    To
                    <input
                      id={`${pickerId}-to`}
                      type="date"
                      value={draftRange.to}
                      onFocus={() => setActiveBoundary('to')}
                      onChange={(event) => handleToInputChange(event.target.value)}
                      className={`mt-2 h-10 w-full rounded-lg border px-2 text-xs font-normal text-charcoal outline-none transition-all ${activeBoundary === 'to'
                        ? 'border-primary ring-2 ring-primary/15 shadow-sm'
                        : 'border-cloud hover:border-gray-300'
                      }`}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-cloud pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="h-9 min-w-[92px] rounded-lg border border-cloud px-4 text-xs font-semibold text-charcoal transition-colors hover:border-primary hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="h-9 min-w-[92px] rounded-lg bg-primary px-4 text-xs font-semibold text-white transition-colors hover:bg-primary-glow"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
