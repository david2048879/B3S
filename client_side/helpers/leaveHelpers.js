const { formatTextDateInput } = require("../helpers/dateHelper");


exports.checkIfIsAWeekendDate = (value) => {
    const checkDate = new Date(value);
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
        return true
    }
    return false
}

exports.checkIfIsAWeekendHowManyDaysShouldBeAdded = (checkDate) => {
    let daysToAdd = 0
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
        if (checkDate.getDay() === 6) {
            daysToAdd = 2
        }
        else {
            daysToAdd = 1
        }
        return { check: true, addOnDays: daysToAdd }
    }
    return { check: false }
}

exports.calculateWeekendDays = (startDate, daysDifference) => {
    let weekendDays = 0;
    Array.from({ length: daysDifference }, (_, i) => {
        const currentDate = new Date(startDate + "T00:00:00");
        currentDate.setDate(currentDate.getDate() + i);
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekendDays = weekendDays + 1;
        }
    })
    return weekendDays;

}

exports.calculateWeekendDaysInDates = (startDate, endDate) => {
    let weekendDays = 0;
    const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()), 0);
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // Ensure that even if there's only one weekend day, it is counted as two
    Array.from({ length: diffDays + 1 }, (_, i) => {
        const currentDate = new Date(startDate.getTime());
        currentDate.setDate(startDate.getDate() + i);
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekendDays += 1;
        }
    });
    return Math.max(weekendDays);
};


exports.checkForDuplicate = (dates, newDate) => {
    const isDuplicate = dates.includes(newDate);
    return isDuplicate;
};


exports.calculateOffDays = (allofdays, startDate, endDate) => {
    const offdays = allofdays.map((offday) => new Date(formatTextDateInput(offday.day)));
    const offdaysInRange = offdays.filter((offday) => {
        return offday >= new Date(startDate) && offday <= new Date(endDate);
    });
    return offdaysInRange.map((days) => formatTextDateInput(days));
};


exports.checkIfLeaveIsStillActive = (startDate, endDate) => {
    const today = new Date();
    // Convert start date and end date strings to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    // Check if today's date is within the range of start date and end date
    return today >= startDateObj && today <= endDateObj;
};




