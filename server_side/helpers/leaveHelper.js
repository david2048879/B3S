

exports.calculateWeekendDaysInDates = (startDate, endDate) => {
    let weekendDays = 0;
    const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()), 0);
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    Array.from({ length: diffDays + 1 }, (_, i) => {
        const currentDate = new Date(startDate.getTime());
        currentDate.setDate(startDate.getDate() + i);
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekendDays +=  1;
        }
    });
    return Math.max(weekendDays);
};


exports.calculateOffDays = (allofdays, startDate, endDate) => {
    const offdays = allofdays.map((offday) => new Date(offday.day));
    const offdaysInRange = offdays.filter((offday) => {
      return offday >= new Date(startDate) && offday <= new Date(endDate);
    });
    return offdaysInRange.map((days)=>formatTextDateInput(days));
  };

  
  exports.checkIfIsAWeekendHowManyDaysShouldBeAdded = (checkDate) => {
    let daysToAdd=0
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
        if(checkDate.getDay()===6)
        {
            daysToAdd=2
        }
        else{
            daysToAdd=1
        }
        return {check:true,addOnDays:daysToAdd}
    }
    return {check:false}
}

